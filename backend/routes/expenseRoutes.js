const express = require("express");
const router = express.Router({ mergeParams: true });
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/receiptsMiddleware");
const {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  downloadReceipt,
} = require("../controllers/expenseController");


router.get("/", protect, getExpenses);
router.post("/", protect, upload.single("receipt"), createExpense);
router.put("/:expenseId", protect, upload.single("receipt"), updateExpense);
router.delete("/:expenseId", protect, deleteExpense);
router.get("/:expenseId/receipt", protect, downloadReceipt);

module.exports = router;
