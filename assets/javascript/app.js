var topicArray = ['happy birthday', 'rock n roll', 'whatever', 'say what?', 'shut up', 'dumb ass', 'i love you', 'i hate you', 'smart ass', 'jerk'];
var key = 'zA88WkZErYONDOUWyX1sVGfJRAX6Um7p';
var url = 'https://api.giphy.com/v1/gifs/search?q=';
var api_key = '&api_key=';
var limit = '&limit=10';
var playing;


function renderButtons() {

    $('#topic-container').empty();

    var savedArray = JSON.parse(localStorage.getItem('topicArray'));
    if (savedArray) {
        topicArray = savedArray;
    }

    topicArray.map(item => {

        var btn = $('<button>').addClass('btn-sm btn-info gif-btn').attr('data-topic', item).text(item);
        $('#topic-container').append(btn);
    });
};

function getGifs(topic) {

    var searchTopic = topic.replace(/ /g, "+");
    var searchUrl = url + searchTopic + api_key + key + limit;

    console.log('topic', topic);
    console.log('topic', searchTopic);


    $('#gif-container').empty();

    $.get(searchUrl).then(function (res) {
        console.log('response = ', res);

        var data = res.data;

        data.map(item => {
            var fixed = item.images.fixed_height_small_still.url;
            var animated = item.images.fixed_height_small.url;
            var rating = item.rating;
            var img = $('<img>').addClass('gif-image figure-img rounded').attr({ src: fixed, 'data-still': fixed, 'data-animate': animated, 'data-state': 'still' });
            var figcaption = $('<figcaption>').addClass('figure-caption').text('rating: ' + rating);
            var figure = $('<figure>').addClass('figure').append(figcaption).append(img);

            $('#gif-container').append(figure);
            $('.gif-heading').text(topic);

        });
    });
};

$(document).on('click', '.gif-btn', function () {

    var _this = $(this);
    var topic = _this.attr('data-topic');
    getGifs(topic);
});

$(document).on('click', '.gif-image', function () {
    var _this = $(this);
    var state = _this.attr('data-state');

    if (playing) {
        playing.attr('data-state', 'still');
        playing.attr('src', playing.attr('data-still'));
    }

    if (state == 'still') {

        _this.attr('data-state', 'animate');
        _this.attr('src', _this.attr('data-animate'));
        playing = _this;
        
    }
    else if (state == 'animate') {

        _this.attr('data-state', 'still');
        _this.attr('src', _this.attr('data-still'));

    }
});

$('#add-topic-btn').on('click', function(event) {
    event.preventDefault();
    var topic = $('#topic-input').val().trim();

    if (topic != '' && !topicArray.includes(topic)) {
        topicArray.push($('#topic-input').val().trim());
        localStorage.setItem('topicArray', JSON.stringify(topicArray));
        renderButtons();
        getGifs(topic);
    }

    $('#topic-input').val('');

});

renderButtons();

