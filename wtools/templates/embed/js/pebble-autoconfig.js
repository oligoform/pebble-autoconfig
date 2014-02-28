if( /iPhone|iPad|iPod/i.test(navigator.userAgent) ) {
	var element = document.getElementById("header");
	element.parentNode.removeChild(element);
}

function log (text) {
	var logdiv = document.getElementById("logdiv");
	logdiv.innerHTML = text + "<br>" + logdiv.innerHTML;
	console.log(text);
}

log("User-agent: " + navigator.userAgent );
var dictionary = {};

document.querySelector( "form" ).addEventListener( "submit", function( event ) {
	if ( this.checkValidity() && checkValidityAndroid(this)) {
		{% if 'items' in preferences %}
		{%- for item in preferences['items']: %}
		{%- if item['type'] == 'string' %}
		dictionary['{{ item['name'] }}'] = document.getElementById('{{ item['name'] }}').value;
		{%- elif item['type'] == 'boolean' %}
		dictionary['{{ item['name'] }}'] = (document.getElementById('{{ item['name'] }}').checked ? 1 : 0);
		{%- else %}
		dictionary['{{ item['name'] }}'] = parseInt(document.getElementById('{{ item['name'] }}').value);
		{%- endif %}
		{%- endfor %}
		{% endif %}

		location.href = 'pebblejs://close#' + encodeURIComponent(JSON.stringify(dictionary));
	}
	event.preventDefault();
});

document.getElementById('cancel').addEventListener('click', function (event) {
	log("Cancel clicked");
	location.href = 'pebblejs://close#';
});

try {
	dictionary = REPLACED_AT_RUNTIME;
} catch(e) {
	dictionary = {}
}

{% if 'items' in preferences %}
{% for item in preferences['items']: %}
if(!dictionary.hasOwnProperty('{{ item['name'] }}')) {
	{%- if item['type'] == 'boolean' %}
	dictionary['{{ item['name'] }}'] = {{ item['default']|lower }};
	{%- else %}
	dictionary['{{ item['name'] }}'] = '{{ item['default'] }}';
	{%- endif %}
}
{%- if item['type'] == 'enum' %}
document.getElementById('{{ item['name'] }}').value = dictionary['{{ item['name'] }}'].toString();
{%- elif item['type'] == 'integer' %}
document.getElementById('{{ item['name'] }}').value = dictionary['{{ item['name'] }}'].toString();
{%- elif item['type'] == 'boolean' %}
document.getElementById('{{ item['name'] }}').checked = dictionary['{{ item['name'] }}'];
{%- elif item['type'] == 'string' %}
document.getElementById('{{ item['name'] }}').value = dictionary['{{ item['name'] }}'];
{%- endif %}
{%- endfor %}
{%- endif %}