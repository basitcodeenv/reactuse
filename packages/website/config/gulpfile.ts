import path from "node:path";
import fs from "fs-extra";
import { parallel, series } from "gulp";
import webpack from "webpack";
import type { WebpackConfiguration } from "webpack-cli";
import { clientOutput, serverOutput } from "./constant";
import webpackClientConfig from "./webpack.client";
import webpackServerConfig from "./webpack.server";

const webpackRun = function (
  webpackConfig: WebpackConfiguration,
  callback: any,
) {
  const compiler = webpack(webpackConfig);
  compiler.run((error) => {
    if (!error) {
      callback && callback();
    }
    else {
      throw error;
    }
  });
};
const clientSideBuild = (callback: (...args: any[]) => any) => {
  webpackRun(webpackClientConfig, callback);
};

const clientSideClean = (callback: (...args: any[]) => any) => {
  fs.removeSync(clientOutput);
  callback();
};

const serverSideClean = (callback: (...args: any[]) => any) => {
  fs.removeSync(serverOutput);
  callback();
};

const serverSideBuild = (callback: (...args: any[]) => any) => {
  webpackRun(webpackServerConfig, callback);
};

const distClean = (callback: (...args: any[]) => any) => {
  const dist = path.resolve(__dirname, "../ssg");
  fs.removeSync(dist);
  callback();
};

const task = series(
  parallel(clientSideClean, serverSideClean, distClean),
  parallel(clientSideBuild, serverSideBuild),
);

export default task;
