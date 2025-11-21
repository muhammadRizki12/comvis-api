const fs = require("fs").promises;

async function deleteDirectory(dirPath) {
  try {
    await fs.rm(dirPath, { recursive: true, force: true });
    console.log(`Direktori ${dirPath} berhasil dihapus!`);
  } catch (error) {
    console.error("Gagal menghapus direktori:", error);
  }
}

module.exports = { deleteDirectory };
