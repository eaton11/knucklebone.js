// knucklebone().get("http://localhost:8888/Github/knucklebone.js/data.json", finish);
// var superForm = document.getElementById("superForm");
// superForm.addEventListener('submit',  function(evt){
// 	knucklebone().submitForm(evt);
// } );
// knucklebone().post("http://localhost:8888/Github/knucklebone.js/data.json", superForm, finish);
knucklebone().formListener("http://localhost:8888/Github/knucklebone.js/process.php", "superForm", finish);

function start(){
	console.log("cool");
};
function finish(res){
	console.log(res);
}