# claro
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Spanish Quiz</title>
</head>
<body>
  <h1>Mini Spanish Quiz</h1>

  <p id="question"></p>
  <input type="text" id="answer" placeholder="Type your answer">
  <button onclick="checkAnswer()">Submit</button>
  <p id="feedback"></p>

  <script>
    const questions = [
      {en: "dog", es: "perro"},
      {en: "house", es: "casa"},
      {en: "green", es: "verde"},
      {en: "book", es: "libro"}
    ];

    let current = 0;

    function showQuestion() {
      document.getElementById("question").textContent = 
        `Translate into Spanish: ${questions[current].en}`;
      document.getElementById("answer").value = "";
      document.getElementById("feedback").textContent = "";
    }

    function checkAnswer() {
      const user = document.getElementById("answer").value.trim().toLowerCase();
      const correct = questions[current].es;

      if (user === correct) {
        document.getElementById("feedback").textContent = "✅ Correct!";
      } else {
        document.getElementById("feedback").textContent = `❌ Wrong, it is "${correct}"`;
      }

      current = (current + 1) % questions.length;
      setTimeout(showQuestion, 1500);
    }

    showQuestion();
  </script>
</body>
</html>
