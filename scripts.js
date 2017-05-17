var text;
for (i = 0; i < 8; i++) {
    text += "fero " + i + "<br>";
}
console.log(text);
var div = document.getElementById('sidebar');
div.innerHTML = text;
