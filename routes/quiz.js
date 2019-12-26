const router = require("express").Router();
const Quiz = require("../db/models/quiz");
const quizController = require("../controllers/quiz.controller");
const errorMiddleware = require("../middleware/errors");
const quizValidator = require("../middleware/validation");
const auth = require("../middleware/auth");

router.get("/", quizController.getAllQuizzes);
router.get("/getquiz", quizValidator.getQuizValidator, quizController.getQuiz);
router.post("/", auth, quizValidator.createQuizvalidator, quizController.createQuiz);
router.put(
  "/:id",
  auth,
  quizValidator.QuizParamId,
  quizValidator.questionValidation(),
  quizController.addQuestion
);
router.delete("/:id", auth, quizValidator.QuizParamId, quizValidator.deleteQuestion, quizController.deleteQuestion);
router.use(errorMiddleware);

module.exports = router;