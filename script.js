
var tagArray = [
	"jeux", "graphique", "utilitaire", "3D", "multijoueurs", "omega-only", "snake", "module", "animation", "turing-complet ?"
]

var query = {
	"with": [],
	"without": [],
}

function get_color(txt) {
	n = 0;
	for (var i = 0; i < txt.length; i++) {
		n *= 256;
		n += txt[i].charCodeAt();
		n %= 100000000;
	}
	n = n ** 2;
	n %= (256 ** 3);
	return "#" + n.toString(16);
}

function getClass(txt) {
	txt = txt.toLowerCase();
	txt = txt.replace(/[0-9]/, "");
	return txt;
}

var divWorkshop = document.getElementById("workshop");

var tagDiv = {
	"other": document.getElementById("other"),
	"denied": document.getElementById("denied"),
	"search": document.getElementById("search"),
}

var style = document.createElement("style");
style.type = "text/css";
for (var i = 0; i < tagArray.length; i++) {
	let color = get_color(tagArray[i]);
	style.innerHTML += " span.tag." + getClass(tagArray[i]) + " { color: " + color + "; border-color: " + color + "; }\n";
}
document.head.appendChild(style);

function select(with_ = [], without = []) {
	toReturn = scripts.slice();
	for (var i = toReturn.length - 1; i >= 0; i--) {
		for (var j = 0; j < without.length; j++) {
			if (toReturn[i]["tags"].indexOf(without[j]) != -1) {
				toReturn.splice(i, 1);
				break;
			}
		}
		if(i==toReturn.length){
			continue;
		}
		for (var j = 0; j < with_.length; j++) {
			if (toReturn[i]["tags"].indexOf(with_[j]) == -1) {
				toReturn.splice(i, 1);
				break;
			}
		}
	}
	return toReturn;
}

function show(scripts2show = scripts) {
	completeAddDiv = "";
	authors = [];
	for (var i = scripts2show.length-1; i >=0 ; i--) {
		let script = scripts2show[i];
		let addDiv = '<div class="script">';
		let link = 'https://my.numworks.com/python/' + script["author"] + "/" + script["name"];
		let authorLink = "https://my.numworks.com/python/" + script["author"];
		let imgSrc = '/images/' + (script["extension"] || script["author"] + "-" + script["name"] + ".png");
		addDiv += '<h2><a href="' + link + '">' + script["name"] + '</a> de <a href="' + authorLink + '">' + script["author"] + '</a> </h2> <img src="' + imgSrc + '">';
		addDiv += "<p>"
		for (var j = 0; j < (script["tags"] || []).length; j++) {
			addDiv += '<span class="tag ' + getClass(script["tags"][j]) + '">' + script["tags"][j] + "</span> ";
		}
		addDiv += "</p></div>";
		completeAddDiv += addDiv;
		if (authors[scripts2show[i].author] == undefined) {
			authors.push(scripts2show[i].author);
			authors[scripts2show[i].author] = 0;
		}
		authors[scripts2show[i].author] += 1;
	}
	divWorkshop.innerHTML = '<p style="color:#555;font-style: italic;">' + scripts2show.length + ' programmes de ' + authors.length + ' Programmeurs.</p>';
	divWorkshop.innerHTML += completeAddDiv;
}

function transfert(tag){
	if(query["with"].indexOf(tag)!=-1){
		query["with"].splice(query["with"].indexOf(tag),1);
		query["without"].push(tag);
	}else if(query["without"].indexOf(tag)!=-1){
		query["without"].splice(query["without"].indexOf(tag),1);
	}else{
		query["with"].push(tag);
	}
	update();
}

function update() {
	show(select(query["with"], query["without"]));
	var innerHTML_ = {
		"other": '<span class="tag_title">Autres :</span><br>',
		"denied": '<span class="tag_title">Refusés :</span><br>',
		"search": '<span class="tag_title">Voulus :</span><br>',
	}
	for(var i=0;i<tagArray.length;i++){
		let txt='<span onclick="transfert(\''+tagArray[i]+'\');" class="tag ' + getClass(tagArray[i]) + '">' + tagArray[i] + "</span> ";
		if(query["with"].indexOf(tagArray[i])!=-1){
			innerHTML_["search"] += txt;
		}else if(query["without"].indexOf(tagArray[i])!=-1){
			innerHTML_["denied"] += txt;
		}else{
			innerHTML_["other"] += txt;
		}
	}
	tagDiv["other"].innerHTML=innerHTML_["other"];
	tagDiv["denied"].innerHTML=innerHTML_["denied"];
	tagDiv["search"].innerHTML=innerHTML_["search"];
}

update();
