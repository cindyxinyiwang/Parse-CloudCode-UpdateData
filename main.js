
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

Parse.Cloud.job("moveAnswers", function(request, status) {
	var Answers = Parse.Object.extend("Answers");
	
	var day = new Date();
	day.setDate(day.getDate()-1);
	
	var AnswerInProgress = Parse.Object.extend("AnswerInProgress");
	var queryCurrentAnswer = new Parse.Query(AnswerInProgress);
	queryCurrentAnswer.lessThan("createdAt", day);
	queryCurrentAnswer.find({
		success:function(results) {
		for (var i = 0, len = results.length; i < len; i++) {
			var result = results[i];
			var questionSave = result.get("question");
			var userSave = result.get("user");
			var answerSave = result.get("answer");
			var answerArraySave = result.get("answerArray");
			     
			var answer = new Answers();
				// configure the answer
			answer.set("question", questionSave);
			answer.set("user", userSave);
			answer.set("answer", answerSave);
			answer.set("answerArray", answerArraySave);
			answer.save (null, {
				success:function(answer){
					Console.log("Saved Successfully");
				},

				error:function(answer, error){
					alert.error("Error: " + error.message); 
				}
			});
			result.destroy({});
			}

		status.success("Moved Successfully");
		},
		error: function(error) {
		status.error("Something went wrong");
		}	
	});

});
