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

function fetchComments() {
  fetch("/data")
    .then( response => response.json() )
    .then( messages => {
        // Add it to the page.
        const commentsContainerDiv = document.getElementById('comments-container');
        commentsContainerDiv.innerHtml = '';

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

        tableHeaderRow.appendChild(tableHeaderRowMessage);
        tableHeaderRow.appendChild(tableHeaderRowImage);
        tableHeaderRow.appendChild(tableHeaderRowTimestamp);

        messages.forEach( comment => {
            var message = comment.message;
            var image = comment.imageUrl;
            var timestamp = comment.timestamp;
            console.log("table row " + message + ": " + image + " " + timestamp);

            var tableRow = document.createElement("tr");
            tableElement.appendChild(tableRow);

            var tableRowMessage = document.createElement("th");
            tableRowMessage.innerText = message;

            var tableRowImage = document.createElement("th");
            if (image != "") {
                var imgElement = document.createElement("img");
                imgElement.src=image;
                imgElement.alt = "This is image of comment";
                tableRowImage.appendChild(imgElement);
            }

            var tableRowTimestamp = document.createElement("th");
            tableRowTimestamp.innerText = timestamp;

            tableRow.appendChild(tableRowMessage);
            tableRow.appendChild(tableRowImage);
            tableRow.appendChild(tableRowTimestamp);

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

        const postCommentDiv = document.getElementById('add-comments-container');
        postCommentDiv.style.display = "block";
    })
}