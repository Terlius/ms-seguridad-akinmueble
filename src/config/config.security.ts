export namespace securityConfig {
  export const keyJWT =  process.env.SECRET_PASS_JWT;
  export const menuUserId = "64276c1a7ce597744892de1b";
  export const listAction = "list";
  export const saveAction = "save";
  export const editAction = "edit";
  export const eliminateAction = "eliminate";
  export const downloadAction = "download";
  export const mongodbConnectionString = process.env.CONNECTION_STRING_MONGODB;
}
