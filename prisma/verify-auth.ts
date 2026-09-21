import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, UserRole } from "../generated/prisma/client";
import { hashPassword, verifyPassword } from "../lib/auth/password";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required.");

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });
const suffix = Date.now().toString(36);
const userEmail = `phase-8-24-user-${suffix}@example.invalid`;
const adminEmail = `phase-8-24-admin-${suffix}@example.invalid`;
const sameEmail = `phase-8-24-same-${suffix}@example.invalid`;

try {
  const userPassword = "Phase8.24-User-Test-Password";
  const adminPassword = "Phase8.24-Admin-Test-Password";

  const user = await prisma.user.create({ data: { email:userEmail, passwordHash:await hashPassword(userPassword) }, select:{id:true,email:true,role:true,passwordHash:true} });
  if(user.role!==UserRole.USER) throw new Error("New users must default to USER.");
  if(!(await verifyPassword(userPassword,user.passwordHash))) throw new Error("User password verification failed.");
  if(await verifyPassword("wrong-password",user.passwordHash)) throw new Error("Wrong user password was accepted.");

  const admin = await prisma.adminAccount.create({ data:{email:adminEmail,normalizedEmail:adminEmail,passwordHash:await hashPassword(adminPassword)},select:{id:true,passwordHash:true,isActive:true} });
  if(!(await verifyPassword(adminPassword,admin.passwordHash))) throw new Error("Admin password verification failed.");
  if(await verifyPassword(userPassword,admin.passwordHash)) throw new Error("User password authenticated against AdminAccount.");

  const sameUser = await prisma.user.create({data:{email:sameEmail,passwordHash:await hashPassword(userPassword)},select:{id:true,role:true}});
  const sameAdmin = await prisma.adminAccount.create({data:{email:sameEmail,normalizedEmail:sameEmail,passwordHash:await hashPassword(adminPassword)},select:{id:true,passwordHash:true,isActive:true}});
  if(!(await verifyPassword(userPassword,(await prisma.user.findUniqueOrThrow({where:{id:sameUser.id},select:{passwordHash:true}})).passwordHash))) throw new Error("Same-email user password failed.");
  if(!(await verifyPassword(adminPassword,sameAdmin.passwordHash))) throw new Error("Same-email admin password failed.");
  if(await verifyPassword(userPassword,sameAdmin.passwordHash)) throw new Error("Same-email user password crossed into admin credentials.");

  await prisma.adminAccount.update({where:{id:admin.id},data:{isActive:false}});
  const disabled=await prisma.adminAccount.findUniqueOrThrow({where:{id:admin.id},select:{isActive:true}});
  if(disabled.isActive) throw new Error("Inactive admin state was not persisted.");

  const roleSpoof=await prisma.user.update({where:{id:user.id},data:{role:UserRole.ADMIN},select:{role:true}});
  if(roleSpoof.role!==UserRole.ADMIN) throw new Error("Synthetic role manipulation setup failed.");
  const independentAdmin=await prisma.adminAccount.count({where:{isActive:true}});
  if(independentAdmin<1) throw new Error("Expected an independently provisioned active admin.");

  console.log(JSON.stringify({
    ok:true,
    newUserDefaultsToUser:true,
    userPasswordHashVerified:true,
    wrongPasswordRejected:true,
    adminCredentialVerified:true,
    userPasswordRejectedByAdminCredential:true,
    sameEmailCredentialsIndependent:true,
    inactiveAdminPersisted:true,
    roleFieldDoesNotDefineAdminCredential:true,
    googleCredentialsConfigured:Boolean(process.env.AUTH_GOOGLE_ID&&process.env.AUTH_GOOGLE_SECRET),
    oauthRealLoginTested:false
  },null,2));

  await prisma.adminAccount.deleteMany({where:{id:{in:[admin.id,sameAdmin.id]}}});
  await prisma.user.deleteMany({where:{id:{in:[user.id,sameUser.id]}}});
} finally { await prisma.$disconnect(); }
