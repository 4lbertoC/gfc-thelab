(function(){var a=document.getElementById("loadText"),b=0,c=["Almost done...","One more second...","Another script loaded...","Images fetched...","Something else is ready...","Keep reading...","Only few files left to finish...","NULL POINTER EXCEPTION","Just joking...","Your connection is SLOW.","Let's start again...","Loading..."],d=c.length,e=function(){return document.all?a.innerText:a.textContent},f=function(b){document.all?a.innerText=b:a.textContent=b},g=setInterval(function(){if(a&&a.parentElement&&"Done!"!=e()){var h=b++%d;f(c[h])}else clearInterval(g)},500)})();