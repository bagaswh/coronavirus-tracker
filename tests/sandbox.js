const notifier = require('node-notifier');
const path = require('path');

notifier.notify(
  {
    title: 'My awesome title',
    message: 'Hello from node, Mr. User!',
    // icon: path.join(__dirname, 'coulson.jpg'), // Absolute path (doesn't work on balloons)
    sound: true, // Only Notification Center or Windows Toasters
    wait: true // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait
  },
  function(err, response) {
    // Response is response from notification
    console.log(response.charCodeAt(0));
  }
);

notifier.on('click', function(notifierObject, options, event) {
  console.log('click');
  // Triggers if `wait: true` and user clicks notification
});
