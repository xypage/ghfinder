$(document).ready(function(){
  var clientID = '8ca9d1ec9de52e3bc317',
  clientSecret = '65dcbf1b58cdf4d1f7f05cc27511f59cfa90e7b8',
  counter = 0;

  function test(testing) { //just checks if a value is null so it can throw something besides undefined, which looks out of place
    if (testing) {
      return testing;
    } else {
      return 'N/A';
    }
  }

  function urlExists(url, cb){ //checks to see if it exists
    jQuery.ajax({
        url:      url,
        dataType: 'text',
        type:     'GET',
        complete:  function(xhr){
            if(typeof cb === 'function')
               cb.apply(this, [xhr.status]);
        }
    });
}

  //when someone hits a key on the search box...
  //use jQuery to target your search box (input form)
  $('#submit').on('click', function(e){
    e.preventDefault();
    //set username equal to the value of what the user entered.
    let username = document.querySelector('#searchUser').value;
    console.log(username);
    // Make 2 AJAX requests to Github...
    // 1st AJAX call is to get user information (i.e. name, description, etc.)
      $.ajax({
        url: `https://api.github.com/users/${username}?client_id=${clientID}&client_secret=${clientSecret}`,
        data: {
          client_id: '8ca9d1ec9de52e3bc317',
          client_secret: '65dcbf1b58cdf4d1f7f05cc27511f59cfa90e7b8'
        }
      })
    // when AJAX call is .done() running, run the callback function inside
    // 2nd AJAX call is to get user's REPO info (i.e. number of repos, project information, etc.)
    .done(function(user){

      $.ajax({
        url: `https://api.github.com/users/${username}/repos?client_id=${clientID}&client_secret=${clientSecret}`,
        data: {
          client_id: '8ca9d1ec9de52e3bc317',
          client_secret: '65dcbf1b58cdf4d1f7f05cc27511f59cfa90e7b8',
          // make returned data display in ascending order
          sort: 'created: asc',
          per_page: 5
        }
      })
      // this is why we need two AJAX calls, to return the second repo...
      .done(function(repos){
        // use $.each to iterate over all of the repos
        $.each(repos, function(index, repo){
          // now we can inject our repo and user data for every instance of repos...
          $('#repos').append(`
            <div class="well">
              <div class="row flex-center">
                <div class="col-md-6">
                  <strong>${user.login}</strong>: ${test(repo.description)}
                </div>
                <div class="col-md-3">
                  <span class="label label-default"> Forks: ${test(repo.forks_count)}</span>
                  <span class="label label-primary">Watchers: ${test(repo.watchers_count)}</span>
                  <span class="label label-success">Stars: ${test(repo.stargazers_count)}</span>
                </div>
                <div class="col-md-3 hCenter" id="buttons${counter}">
                  <button class="btn btn-default minWidth"><a href="${repo.html_url}" target="_blank">${repo.name}</a></buttons>
                </div>
              </div>
            </div>
          `);
          urlExists(`https://${user.login}.github.io/${repo.name}`, function(status) {
            if (status !== 404) {
              $('#buttons'+counter).append(`
                <button class="btn btn-default minWidth"><a href="`+`${user.login}.github.io/${repo.name}`+`" target="_blank">The ghpages</a></button>
              `);
            }
          });
        });
      });
      counter++;
      // target the profile section, and use .html to inject HTML code inside of the #profile section
      $('#profile').html(`
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3 class="panel-title">${user.login}</h3>
          </div>
          <div class="panel-body">
            <div class="row">
              <div class="col-md-3">
                <img class="thumbnail avatar img-responsive" src="${user.avatar_url}">
                <a target="_blank" class="btn btn-primary btn-block" href="${user.html_url}">View Profile</a>
              </div>
              <div class="col-md-9">
              <span class="label label-default">Public Repos: ${user.public_repos}</span>
              <span class="label label-primary">Public Gists: ${user.public_gists}</span>
              <span class="label label-success">Followers: ${user.followers}</span>
              <span class="label label-info">Following: ${user.following}</span>
              <br><br>
              <ul class="list-group">
                <li class="list-group-item">Company: ${test(user.company)}</li>
                <li class="list-group-item">Website/blog: <a href="${test(user.blog)}" class='altLink'>${test(user.blog)}</a></li>
                <li class="list-group-item">Location: ${test(user.location)}</li>
                <li class="list-group-item">Member Since: ${test(user.created_at)}</li>
              </ul>
              </div>
            </div>
          </div>
        </div>
        <h3 class="page-header">Latest Repos</h3>
        <div id="repos"></div>
      `);
    });
  });
});
