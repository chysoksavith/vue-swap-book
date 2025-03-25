import fs from "fs";
import path from "path";

const createLogDirection = () => {
  const baseLogPath = path.join(__dirname, "../../logs");

  const directories = [
    path.join(baseLogPath, "access"),
    path.join(baseLogPath, "error"),
    path.join(baseLogPath, "system"),
    path.join(baseLogPath, "debug"),
  ];

  directories.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

export default createLogDirection;
