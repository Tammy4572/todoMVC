

module.exports = {
    index: function( request, response) {
        response.render('main', { title: 'Express Todo '});
    }
};