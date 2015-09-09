var style = document.createElement('style');
style.textContent = " \
#padassistant {  \
  background-color: #fff;  \
  border-left: 1px solid #dfdfdf;  \
  font-size: 1.5em;  \
  height: 100%;  \
  overflow: auto;  \
  position: absolute;  \
  right: 0;  \
  width: 30%;  \
  z-index: 100;  \
}  \
#toggleassistant {  \
  background-color: #e8e9e9;  \
  border: 1px solid #dfdfdf;  \
  color: #fff;  \
  font-size: 2.5em;  \
  font-weight: bold;  \
  height: 32px;  \
  overflow: auto;  \
  position: absolute;  \
  right: 0;  \
  text-align: center;  \
  width: 32px;  \
  z-index: 101;  \
  cursor:pointer;  \
}  \
.tasktype {  \
  color:#000;  \
  background-color:#e8e9e9;  \
  padding:0.8em;  \
  font-weight:bold;  \
}  \
.task {  \
  border-bottom:1px solid #dfdfdf;  \
  padding:0.3em;  \
  cursor:pointer;  \
}  \
.task:hover {  \
  background-color: #F2F7F7;  \
}";
document.head.appendChild(style);

help = ''

function summarize() {
  
  data = $('iframe').contents().find('iframe').contents();
  
  regtype = '^[A-Z :]{2,}$';
  
  regflag = /\[([^\]]{2,})\]/g;
  
  countflag = ':$';
  
  list = {}
  
  colors = {
    '[URGENT]':'red',
    '[RDV]':'green',
    '[CONF]':'blue',
    '[PARL]':'violet'
  };
  
  $.each($(data).find("div[id*='magicdomid']"), function() {
    that = $(this);
    id = this.id;
    text = that.text();
    if(text.match(regtype)) {
      if (that.contents().find('u').length === 1) {
        list[id] = {'tasktype':text, 'tasks':[]}
      }
    }
  });
  
  $.each($(data).find("div[id*='magicdomid']"), function() {
    if (list[this.id] !== undefined) {
      listid = this.id;
    }
    if (typeof listid != 'undefined') {
      if ($(this).find('ul').hasClass('list-bullet1')) {
        list[listid].tasks.push({'id':this.id,'text':$(this).text(),'top':this.getBoundingClientRect().top});
      }
    }
    
  });
  
  if ($('#padassistant').length === 1) {
    $('#padassistant').html('');
  }
  else {
    top = $('#editbar').outerHeight();
    $('#editorcontainer').prepend('<div id="padassistant" style="top: '+top+'px;"></div>');
    $('#editorcontainer').prepend('<div id="toggleassistant" title="Open/Close" onclick="javascript:toggleAssistant()" style="top: '+top+'px;">#</div>');
  }
  
  for (item in list) {
    if (list[item].tasks.length > 0) {
      tasktype = list[item].tasktype;
      if (tasktype.match(countflag)) { tasktype += ' '+list[item].tasks.length; }
      $('#padassistant').append('<div class="tasktype">'+tasktype+'</div>');
      for (task in list[item].tasks) {
        text = list[item].tasks[task].text;
        if (text.match(regflag)) { color = colors[text.match(regflag)[0]]; }
        else { color = 'gray';}
        $('#padassistant').append('<div class="task" onclick="javascript:goToTask(\''+list[item].tasks[task].top+'\')" style="color:'+color+';">'+text+'</div>');
      }
    }
  }
}

function goToTask(top) { 
  $('iframe').contents().find("html, body").animate({ scrollTop: top }, { duration: 'medium', easing: 'swing' });
}

function closePA() {
  $('#padassistant').remove();
}

function toggleAssistant() {
  if ($('#padassistant').length === 1) {
    closePA();
  }
  else {
    summarize();
  }
}

summarize();
