var app = angular.module('quizApp', ['ngRoute']);

app.config(function($routeProvider) {
  $routeProvider
    .when('/quizzes', {
      templateUrl: 'partials/quiz-list.html',
      controller: 'QuizListCtrl'
    })
    .when('/quiz/:id', {
      templateUrl: 'partials/quiz.html',
      controller: 'QuizCtrl'
    })
    .when('/results/:id', {
      templateUrl: 'partials/results.html',
      controller: 'ResultsCtrl'
    })
    .otherwise({
      redirectTo: '/quizzes'
    });
});

function getQuizzes() {
  let quizzes = JSON.parse(localStorage.getItem('quizzes'));
  if (!quizzes) {
    quizzes = [
      {
        id: 1,
        title: 'Sample Quiz',
        questions: [
          {
            id: 1,
            question: 'What is the capital of France?',
            options: ['Paris', 'Berlin', 'London', 'Rome'],
            answer: 'Paris'
          },
          // ...add more questions as you like...
        ]
      },
      // ...add more quizzes as you like...
    ];
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
  }
  return quizzes;
}

app.controller('QuizListCtrl', function($scope) {
  $scope.quizzes = getQuizzes();
});

/* app.controller('QuizCtrl', function($scope, $routeParams, $location) { */
/*   const quizzes = getQuizzes(); */
/*   const quizId = parseInt($routeParams.id, 10); */
/*   $scope.quiz = quizzes.find(quiz => quiz.id === quizId); */
/*   $scope.currentQuestionIndex = 0; */
/*   $scope.finished = false; */
/*   $scope.answers = []; */
/**/
/*   $scope.currentQuestion = function() { */
/*     return $scope.quiz.questions[$scope.currentQuestionIndex]; */
/*   }; */
/**/
/*   $scope.submitAnswer = function(answer) { */
/*     $scope.answers.push({ */
/*       questionId: $scope.currentQuestion().id, */
/*       answer */
/*     }); */
/*     if ($scope.currentQuestionIndex < $scope.quiz.questions.length - 1) { */
/*       $scope.currentQuestionIndex++; */
/*     } else { */
/*       localStorage.setItem(`results_${quizId}`, JSON.stringify($scope.answers)); */
/*       $scope.finished = true; */
/*     } */
/*   }; */
/* }); */

app.controller('QuizCtrl', function($scope, $routeParams, $location) {
  const quizzes = getQuizzes();
  const quizId = parseInt($routeParams.id, 10);
  $scope.quiz = quizzes.find(quiz => quiz.id === quizId);
  $scope.currentQuestionIndex = 0;
  $scope.finished = false;
  $scope.answers = [];

  $scope.currentQuestion = $scope.quiz.questions[$scope.currentQuestionIndex];

  $scope.submitAnswer = function(answer) {
    $scope.answers.push({
      questionId: $scope.currentQuestion.id,
      answer
    });
    if ($scope.currentQuestionIndex < $scope.quiz.questions.length - 1) {
      $scope.currentQuestionIndex++;
      $scope.currentQuestion = $scope.quiz.questions[$scope.currentQuestionIndex];
    } else {
      localStorage.setItem(`results_${quizId}`, JSON.stringify($scope.answers));
      $scope.finished = true;
    }
  };
});


app.controller('ResultsCtrl', function($scope, $routeParams) {
  const quizzes = getQuizzes();
  const quizId = parseInt($routeParams.id, 10);
  $scope.quiz = quizzes.find(quiz => quiz.id === quizId);
  const answers = JSON.parse(localStorage.getItem(`results_${quizId}`));
  $scope.results = answers.map(answer => ({
    question: $scope.quiz.questions.find(q => q.id === answer.questionId),
    answer: answer.answer
  }));
});
