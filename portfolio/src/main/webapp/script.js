// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

function fetchComments(languageCode) {

  var targetUrl = "/data"
  var languageCodeQueryString = "";

  if (languageCode != undefined) {
    languageCodeQueryString = "?lang=" + languageCode;
    targetUrl = targetUrl + languageCodeQueryString;
  } 

  fetch(targetUrl)
    .then( response => response.json() )
    .then( messages => {
        // Add it to the page.
        var commentsContainerDiv = document.getElementById('comments-container');
        commentsContainerDiv.innerHTML = "";

        console.log(messages);

        var tableElement = document.createElement("table");
        commentsContainerDiv.appendChild(tableElement);

        // Create header
        var tableHeaderRow = document.createElement("tr");
        tableElement.appendChild(tableHeaderRow);

        var tableHeaderRowMessage = document.createElement("th");
        tableHeaderRowMessage.innerText = "Comment";
        var tableHeaderRowImage = document.createElement("th");
        tableHeaderRowImage.innerText = "Image";
        var tableHeaderRowTimestamp = document.createElement("th");
        tableHeaderRowTimestamp.innerText = "Timestamp";
        var tableHeaderRowEmail = document.createElement("th");
        tableHeaderRowEmail.innerText = "Email";

        tableHeaderRow.appendChild(tableHeaderRowMessage);
        tableHeaderRow.appendChild(tableHeaderRowImage);
        tableHeaderRow.appendChild(tableHeaderRowTimestamp);
        tableHeaderRow.appendChild(tableHeaderRowEmail);

        messages.forEach( comment => {
            var message = comment.message;
            var image = comment.imageUrl;
            var timestamp = comment.timestamp;
            var email = comment.email;

            if (email == "") {
                email = "anonymous user";
            }
            console.log("table row " + message + ": " + image + " " + timestamp + " " + email);

            var tableRow = document.createElement("tr");
            tableElement.appendChild(tableRow);

            var tableRowMessage = document.createElement("th");
            tableRowMessage.innerText = message;

            var tableRowImage = document.createElement("th");
            if ((image != undefined) && (image != "")) {
                var imgElement = document.createElement("img");
                imgElement.src=image;
                imgElement.alt = "This is image of comment";
                tableRowImage.appendChild(imgElement);
            }

            var tableRowTimestamp = document.createElement("th");
            tableRowTimestamp.innerText = timestamp;

            var tableRowEmail = document.createElement("th");
            tableRowEmail.innerText = email;

            tableRow.appendChild(tableRowMessage);
            tableRow.appendChild(tableRowImage);
            tableRow.appendChild(tableRowTimestamp);
            tableRow.appendChild(tableRowEmail);
        });
    });

    fetchUploadUrl();
}

function fetchUploadUrl() {
    fetch("/uploadblob")
        .then( response => response.text() )
    .then( url => {
        const postForm = document.getElementById('post_comment_form');
        postForm.action = url;

        fetchLoginStatus();
    })
}

function setCommentBoxVisible(isVisible) {
    if (isVisible) {
        const postCommentDiv = document.getElementById('add-comments-container');
        postCommentDiv.style.display = "block";
    } else {
        const postCommentDiv = document.getElementById('add-comments-container');
        postCommentDiv.style.display = "none";
    }
}

function fetchLoginStatus() {
    fetch("/loginstatus")
        .then( response => response.json() )
    .then( loginStatusResult => {
        console.log("Login Status: " + JSON.stringify(loginStatusResult));

        // If logged in, show comment box
        if (loginStatusResult.isLoggedIn) {
            setCommentBoxVisible(true);

            // Show Logout link
            const loginLogoutContainer = document.getElementById('login-logout-container');
            loginLogoutContainer.innerHTML = "";
            
            //Logout <p>Logout <a href=\"" + logoutUrl + "\">here</a>.</p>");
            var logOutLink = document.createElement('a');
            logOutLink.href = loginStatusResult.logOutUrl;
            logOutLink.innerText = "LogOut " + loginStatusResult.account.email;

            loginLogoutContainer.appendChild(logOutLink);
            loginLogoutContainer.style.display = "block";
        }
        // Otherwise, show Login box.
        else {
            setCommentBoxVisible(false);

            // Show Login link
            const loginLogoutContainer = document.getElementById('login-logout-container');
            loginLogoutContainer.innerHTML = "";
            
            //Login <a href=\"" + loginUrl + "\">here</a>.</p>");
            var logInLink = document.createElement('a');
            logInLink.href = loginStatusResult.logInUrl;
            logInLink.innerText = "LogIn";

            loginLogoutContainer.appendChild(logInLink);
            loginLogoutContainer.style.display = "block";
        }
    })
}

function selectNewLanguage() {
    const languageCode = document.getElementById('language').value;

    fetchComments(languageCode);
}