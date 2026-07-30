import { app, loadData } from "../server";

let loaded = false;

export default async function handler(req: any, res: any) {
  if (!loaded) {
    await loadData();
    loaded = true;
  }
  return app(req, res);
}
