/** Minimal typings for module-alias (package has no bundled types). */
declare module "module-alias" {
  const moduleAlias: (packageJsonPath: string) => void;
  export default moduleAlias;
}
