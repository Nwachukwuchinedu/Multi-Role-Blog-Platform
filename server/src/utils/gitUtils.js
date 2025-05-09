// backend/utils/gitUtils.js

import { promisify } from "util";
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Project root (where .git lives)
const projectRoot = path.resolve(__dirname, "../../");

// Promisify exec for async/await
const execAsync = promisify(exec);

/**
 * Auto-commits and pushes file to GitHub using Git CLI
 * @param {string} filePath - Absolute or relative path from project root
 */
export const autoCommitAndPush = async (filePath) => {
  try {
    // ✅ Convert absolute path to relative path from git root
    const relativePath = path
      .relative(projectRoot, filePath)
      .replace(/\\/g, "/");

    console.log(`[Git] Adding ${relativePath}`);

    // ✅ Set git config locally (inside repo)
    await execAsync(`git config user.email "chinedu.simeon2020@gmail.com"`, {
      cwd: projectRoot,
    });
    await execAsync(`git config user.name "Nwachukwuchinedu"`, {
      cwd: projectRoot,
    });

    // Run git commands inside project root
    await execAsync(`git add "${relativePath}"`, { cwd: projectRoot });

    await execAsync(`git commit -m "Add uploaded file: ${relativePath}"`, {
      cwd: projectRoot,
    });

    await execAsync(`git push origin main`, { cwd: projectRoot });

    console.log("✅ Successfully committed and pushed:", relativePath);
  } catch (err) {
    console.error("🚨 Git operation failed:", err.stderr || err.message);
  }
};
