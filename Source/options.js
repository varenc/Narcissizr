// Saves options to chrome.storage
function save_options() {
  var firstName = document.getElementById('fname').value;
  var lastName = document.getElementById('lname').value;

  function regulate(w) {
    return w[0].toUpperCase() + w.slice(1).toLowerCase();
  }

  firstName = regulate(firstName);
  lastName = regulate(lastName);

  chrome.storage.sync.set({
    firstName: firstName,
    lastName: lastName,
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';

    //Update the fields to be their latest saved value
    restore_options();
    setTimeout(function() {
      status.textContent = '';
    }, 1250);
  });
}

function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    firstName: 'Chris',
    lastName: 'Varenhorst',
  }, function(items) {
    document.getElementById('fname').value = items.firstName;
    document.getElementById('lname').value = items.lastName;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);