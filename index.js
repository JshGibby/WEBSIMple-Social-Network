const room = new WebsimSocket();
let posts = [];
room.party.subscribe(peers => {
  console.log(peers);
  for (const clientId in peers) {
    const {
      avatarUrl,
      username
    } = peers[clientId];
    console.log(avatarUrl, username);
  }
});
async function getUserProfile() {
  try {
    const response = await fetch('https://example.com/api/v1/users/@me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return 'Error occurred';
  }
}
function attach(type) {
  const input = document.getElementById('media-upload');
  input.click();
  input.onchange = function () {
    const file = input.files[0];
    if (file) {
      console.log(`User wants to attach a ${type}:`, file.name);
    }
  };
}
function post() {
  const text = document.getElementById('post-text').value;
  if (text.trim() !== "") {
    getUserProfile().then(data => {
      const currentUsername = room.party.client.username;
      const newPost = {
        text: text,
        timestamp: new Date(),
        username: currentUsername,
        profileImage: `https://images.websim.ai/avatar/${currentUsername}`,
        reactions: {
          love: 0,
          like: 0,
          happy: 0,
          sad: 0,
          angry: 0,
          surprised: 0
        },
        usersWhoReacted: {},
        comments: []
      };
      posts.unshift(newPost);
      document.getElementById('post-text').value = '';
      renderPosts();
    });
  }
}
function deletePost(index) {
  posts.splice(index, 1);
  renderPosts();
}
function renderPosts() {
  const newsfeed = document.getElementById('newsfeed');
  newsfeed.innerHTML = '';
  posts.forEach((post, index) => {
    const postDiv = document.createElement('div');
    postDiv.classList.add('post');
    const postHeader = document.createElement('div');
    postHeader.classList.add('post-header');
    const profileImage = document.createElement('img');
    profileImage.src = post.profileImage;
    profileImage.onclick = function () {
      getUserInfo(post.username);
    };
    const usernameSpan = document.createElement('span');
    usernameSpan.textContent = post.username;
    usernameSpan.onclick = function () {
      getUserInfo(post.username);
    };
    const postHeaderContainer = document.createElement('div');
    postHeaderContainer.style.display = 'flex';
    postHeaderContainer.style.alignItems = 'center';
    postHeaderContainer.style.marginBottom = '10px';
    postHeaderContainer.appendChild(profileImage);
    postHeaderContainer.appendChild(usernameSpan);
    usernameSpan.style.marginLeft = '10px';
    const timestampSpan = document.createElement('span');
    timestampSpan.id = `timestamp-${index}`;
    timestampSpan.textContent = getTimeDiff(post.timestamp);
    timestampSpan.style.marginLeft = '10px';
    postHeaderContainer.appendChild(timestampSpan);
    setInterval(function () {
      const timestampSpan = document.getElementById(`timestamp-${index}`);
      timestampSpan.textContent = getTimeDiff(post.timestamp);
    }, 1000);
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-button');
    deleteButton.onclick = function () {
      deletePost(index);
    };
    deleteButton.style.position = 'absolute';
    deleteButton.style.right = '10px';
    deleteButton.style.top = '10px';
    postHeader.appendChild(postHeaderContainer);
    postHeader.appendChild(deleteButton);
    const postParagraph = document.createElement('p');
    postParagraph.textContent = post.text;
    postDiv.appendChild(postHeader);
    postDiv.appendChild(postParagraph);
    const reactionsDiv = document.createElement('div');
    reactionsDiv.classList.add('reactions');
    const loveButton = document.createElement('button');
    loveButton.textContent = `❤️ ${post.reactions.love}`;
    loveButton.onclick = function () {
      const currentUsername = room.party.client.username;
      const postIndex = posts.indexOf(post);
      if (post.usersWhoReacted && post.usersWhoReacted.love && post.usersWhoReacted.love.includes(currentUsername)) {
        post.reactions.love -= 1;
        post.usersWhoReacted.love = post.usersWhoReacted.love.filter(username => username !== currentUsername);
      } else {
        post.reactions.love += 1;
        if (!post.usersWhoReacted) post.usersWhoReacted = {};
        if (!post.usersWhoReacted.love) post.usersWhoReacted.love = [];
        post.usersWhoReacted.love.push(currentUsername);
      }
      loveButton.textContent = `❤️ ${post.reactions.love}`;
      renderPosts();
    };
    reactionsDiv.appendChild(loveButton);
    const likeButton = document.createElement('button');
    likeButton.textContent = `👍 ${post.reactions.like}`;
    likeButton.onclick = function () {
      const currentUsername = room.party.client.username;
      const postIndex = posts.indexOf(post);
      if (post.usersWhoReacted && post.usersWhoReacted.like && post.usersWhoReacted.like.includes(currentUsername)) {
        post.reactions.like -= 1;
        post.usersWhoReacted.like = post.usersWhoReacted.like.filter(username => username !== currentUsername);
      } else {
        post.reactions.like += 1;
        if (!post.usersWhoReacted) post.usersWhoReacted = {};
        if (!post.usersWhoReacted.like) post.usersWhoReacted.like = [];
        post.usersWhoReacted.like.push(currentUsername);
      }
      likeButton.textContent = `👍 ${post.reactions.like}`;
      renderPosts();
    };
    reactionsDiv.appendChild(likeButton);
    const happyButton = document.createElement('button');
    happyButton.textContent = `😊 ${post.reactions.happy}`;
    happyButton.onclick = function () {
      const currentUsername = room.party.client.username;
      const postIndex = posts.indexOf(post);
      if (post.usersWhoReacted && post.usersWhoReacted.happy && post.usersWhoReacted.happy.includes(currentUsername)) {
        post.reactions.happy -= 1;
        post.usersWhoReacted.happy = post.usersWhoReacted.happy.filter(username => username !== currentUsername);
      } else {
        post.reactions.happy += 1;
        if (!post.usersWhoReacted) post.usersWhoReacted = {};
        if (!post.usersWhoReacted.happy) post.usersWhoReacted.happy = [];
        post.usersWhoReacted.happy.push(currentUsername);
      }
      happyButton.textContent = `😊 ${post.reactions.happy}`;
      renderPosts();
    };
    reactionsDiv.appendChild(happyButton);
    const sadButton = document.createElement('button');
    sadButton.textContent = `😔 ${post.reactions.sad}`;
    sadButton.onclick = function () {
      const currentUsername = room.party.client.username;
      const postIndex = posts.indexOf(post);
      if (post.usersWhoReacted && post.usersWhoReacted.sad && post.usersWhoReacted.sad.includes(currentUsername)) {
        post.reactions.sad -= 1;
        post.usersWhoReacted.sad = post.usersWhoReacted.sad.filter(username => username !== currentUsername);
      } else {
        post.reactions.sad += 1;
        if (!post.usersWhoReacted) post.usersWhoReacted = {};
        if (!post.usersWhoReacted.sad) post.usersWhoReacted.sad = [];
        post.usersWhoReacted.sad.push(currentUsername);
      }
      sadButton.textContent = `😔 ${post.reactions.sad}`;
      renderPosts();
    };
    reactionsDiv.appendChild(sadButton);
    const angryButton = document.createElement('button');
    angryButton.textContent = `😠 ${post.reactions.angry}`;
    angryButton.onclick = function () {
      const currentUsername = room.party.client.username;
      const postIndex = posts.indexOf(post);
      if (post.usersWhoReacted && post.usersWhoReacted.angry && post.usersWhoReacted.angry.includes(currentUsername)) {
        post.reactions.angry -= 1;
        post.usersWhoReacted.angry = post.usersWhoReacted.angry.filter(username => username !== currentUsername);
      } else {
        post.reactions.angry += 1;
        if (!post.usersWhoReacted) post.usersWhoReacted = {};
        if (!post.usersWhoReacted.angry) post.usersWhoReacted.angry = [];
        post.usersWhoReacted.angry.push(currentUsername);
      }
      angryButton.textContent = `😠 ${post.reactions.angry}`;
      renderPosts();
    };
    reactionsDiv.appendChild(angryButton);
    const surprisedButton = document.createElement('button');
    surprisedButton.textContent = `😮 ${post.reactions.surprised}`;
    surprisedButton.onclick = function () {
      const currentUsername = room.party.client.username;
      const postIndex = posts.indexOf(post);
      if (post.usersWhoReacted && post.usersWhoReacted.surprised && post.usersWhoReacted.surprised.includes(currentUsername)) {
        post.reactions.surprised -= 1;
        post.usersWhoReacted.surprised = post.usersWhoReacted.surprised.filter(username => username !== currentUsername);
      } else {
        post.reactions.surprised += 1;
        if (!post.usersWhoReacted) post.usersWhoReacted = {};
        if (!post.usersWhoReacted.surprised) post.usersWhoReacted.surprised = [];
        post.usersWhoReacted.surprised.push(currentUsername);
      }
      surprisedButton.textContent = `😮 ${post.reactions.surprised}`;
      renderPosts();
    };
    reactionsDiv.appendChild(surprisedButton);
    const postFooter = document.createElement('div');
    postFooter.classList.add('post-footer');
    postFooter.appendChild(reactionsDiv);
    const commentButton = document.createElement('button');
    commentButton.textContent = 'Comment';
    commentButton.classList.add('comment-button');
    commentButton.onclick = function () {
      const commentArea = this.nextElementSibling;
      if (commentArea.style.display === 'block') {
        commentArea.style.display = 'none';
      } else {
        commentArea.style.display = 'block';
      }
    };
    postFooter.appendChild(commentButton);
    postDiv.appendChild(postFooter);
    const commentArea = document.createElement('div');
    commentArea.classList.add('comment-area');
    const commentTextarea = document.createElement('textarea');
    commentTextarea.classList.add('comment-textarea');
    commentArea.appendChild(commentTextarea);
    const commentButtons = document.createElement('div');
    commentButtons.classList.add('comment-buttons');
    commentArea.appendChild(commentButtons);
    const commentCancelButton = document.createElement('button');
    commentCancelButton.textContent = 'Cancel';
    commentCancelButton.classList.add('comment-cancel-button');
    commentCancelButton.onclick = function () {
      commentArea.style.display = 'none';
    };
    commentButtons.appendChild(commentCancelButton);
    const commentReplyButton = document.createElement('button');
    commentReplyButton.textContent = 'Reply';
    commentReplyButton.classList.add('comment-reply-button');
    commentReplyButton.onclick = function () {
      const commentText = commentTextarea.value;
      if (commentText.trim() !== "") {
        const newComment = {
          text: commentText,
          timestamp: new Date(),
          username: room.party.client.username,
          profileImage: `https://images.websim.ai/avatar/${room.party.client.username}`,
          reactions: {
            love: 0,
            like: 0,
            happy: 0,
            sad: 0,
            angry: 0,
            surprised: 0
          },
          usersWhoReacted: {}
        };
        if (!post.comments) post.comments = [];
        post.comments.push(newComment);
        renderComments(post, postDiv);
        commentTextarea.value = '';
        commentArea.style.display = 'none';
      }
    };
    commentButtons.appendChild(commentReplyButton);
    postDiv.appendChild(commentArea);
    newsfeed.appendChild(postDiv);
  });
}
function getTimeDiff(timestamp) {
  const currentTime = new Date();
  const timeDiff = currentTime - timestamp;
  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (seconds < 60) {
    return `Posted ${seconds} seconds ago`;
  } else if (minutes < 60) {
    return `Posted ${minutes} minutes ago`;
  } else if (hours < 24) {
    return `Posted ${hours} hours ago`;
  } else {
    return `Posted ${days} days ago`;
  }
}
function getUserInfo(username) {
  const UserProfileUrl = `https://websim.ai/@${username}`;
  window.open(UserProfileUrl, '_blank');
}
function renderComments(post, postDiv) {
  const commentsDiv = document.createElement('div');
  commentsDiv.style.marginTop = '10px';
  postDiv.appendChild(commentsDiv);
  if (post.comments) {
    post.comments.forEach((comment, index) => {
      const commentDiv = document.createElement('div');
      commentDiv.style.padding = '10px';
      commentDiv.style.borderBottom = '1px solid #ddd';
      commentsDiv.appendChild(commentDiv);
      const commentHeader = document.createElement('div');
      commentHeader.style.display = 'flex';
      commentHeader.style.alignItems = 'center';
      commentHeader.style.marginBottom = '10px';
      commentDiv.appendChild(commentHeader);
      const profileImage = document.createElement('img');
      profileImage.src = comment.profileImage;
      profileImage.style.width = '30px';
      profileImage.style.height = '30px';
      profileImage.style.borderRadius = '50%';
      profileImage.style.marginRight = '10px';
      commentHeader.appendChild(profileImage);
      const usernameSpan = document.createElement('span');
      usernameSpan.textContent = comment.username;
      usernameSpan.style.fontWeight = 'bold';
      usernameSpan.style.marginRight = '10px';
      commentHeader.appendChild(usernameSpan);
      const timestampSpan = document.createElement('span');
      timestampSpan.id = `comment-timestamp-${index}`;
      timestampSpan.textContent = getTimeDiff(comment.timestamp);
      commentHeader.appendChild(timestampSpan);
      setInterval(function () {
        const timestampSpan = document.getElementById(`comment-timestamp-${index}`);
        timestampSpan.textContent = getTimeDiff(comment.timestamp);
      }, 1000);
      const commentText = document.createElement('p');
      commentText.textContent = comment.text;
      commentDiv.appendChild(commentText);
      const commentReactionsDiv = document.createElement('div');
      commentReactionsDiv.style.display = 'flex';
      commentReactionsDiv.style.alignItems = 'center';
      commentReactionsDiv.style.marginTop = '5px';
      const commentFooter = document.createElement('div');
      commentFooter.classList.add('post-footer');
      commentDiv.appendChild(commentFooter);
      commentFooter.appendChild(commentReactionsDiv);
      const loveButton = document.createElement('button');
      loveButton.textContent = `❤️ ${comment.reactions ? comment.reactions.love : 0}`;
      loveButton.onclick = function () {
        const currentUsername = room.party.client.username;
        const commentIndex = post.comments.indexOf(comment);
        if (comment.usersWhoReacted && comment.usersWhoReacted.love && comment.usersWhoReacted.love.includes(currentUsername)) {
          comment.reactions.love -= 1;
          comment.usersWhoReacted.love = comment.usersWhoReacted.love.filter(username => username !== currentUsername);
        } else {
          comment.reactions.love += 1;
          if (!comment.usersWhoReacted) comment.usersWhoReacted = {};
          if (!comment.usersWhoReacted.love) comment.usersWhoReacted.love = [];
          comment.usersWhoReacted.love.push(currentUsername);
        }
        loveButton.textContent = `❤️ ${comment.reactions.love}`;
        renderComments(post, postDiv);
      };
      commentReactionsDiv.appendChild(loveButton);
      const likeButton = document.createElement('button');
      likeButton.textContent = `👍 ${comment.reactions ? comment.reactions.like : 0}`;
      likeButton.onclick = function () {
        const currentUsername = room.party.client.username;
        const commentIndex = post.comments.indexOf(comment);
        if (comment.usersWhoReacted && comment.usersWhoReacted.like && comment.usersWhoReacted.like.includes(currentUsername)) {
          comment.reactions.like -= 1;
          comment.usersWhoReacted.like = comment.usersWhoReacted.like.filter(username => username !== currentUsername);
        } else {
          comment.reactions.like += 1;
          if (!comment.usersWhoReacted) comment.usersWhoReacted = {};
          if (!comment.usersWhoReacted.like) comment.usersWhoReacted.like = [];
          comment.usersWhoReacted.like.push(currentUsername);
        }
        likeButton.textContent = `👍 ${comment.reactions.like}`;
        renderComments(post, postDiv);
      };
      commentReactionsDiv.appendChild(likeButton);
      const happyButton = document.createElement('button');
      happyButton.textContent = `😊 ${comment.reactions ? comment.reactions.happy : 0}`;
      happyButton.onclick = function () {
        const currentUsername = room.party.client.username;
        const commentIndex = post.comments.indexOf(comment);
        if (comment.usersWhoReacted && comment.usersWhoReacted.happy && comment.usersWhoReacted.happy.includes(currentUsername)) {
          comment.reactions.happy -= 1;
          comment.usersWhoReacted.happy = comment.usersWhoReacted.happy.filter(username => username !== currentUsername);
        } else {
          comment.reactions.happy += 1;
          if (!comment.usersWhoReacted) comment.usersWhoReacted = {};
          if (!comment.usersWhoReacted.happy) comment.usersWhoReacted.happy = [];
          comment.usersWhoReacted.happy.push(currentUsername);
        }
        happyButton.textContent = `😊 ${comment.reactions.happy}`;
        renderComments(post, postDiv);
      };
      commentReactionsDiv.appendChild(happyButton);
      const sadButton = document.createElement('button');
      sadButton.textContent = `😔 ${comment.reactions ? comment.reactions.sad : 0}`;
      sadButton.onclick = function () {
        const currentUsername = room.party.client.username;
        const commentIndex = post.comments.indexOf(comment);
        if (comment.usersWhoReacted && comment.usersWhoReacted.sad && comment.usersWhoReacted.sad.includes(currentUsername)) {
          comment.reactions.sad -= 1;
          comment.usersWhoReacted.sad = comment.usersWhoReacted.sad.filter(username => username !== currentUsername);
        } else {
          comment.reactions.sad += 1;
          if (!comment.usersWhoReacted) comment.usersWhoReacted = {};
          if (!comment.usersWhoReacted.sad) comment.usersWhoReacted.sad = [];
          comment.usersWhoReacted.sad.push(currentUsername);
        }
        sadButton.textContent = `😔 ${comment.reactions.sad}`;
        renderComments(post, postDiv);
      };
      commentReactionsDiv.appendChild(sadButton);
      const angryButton = document.createElement('button');
      angryButton.textContent = `😠 ${comment.reactions ? comment.reactions.angry : 0}`;
      angryButton.onclick = function () {
        const currentUsername = room.party.client.username;
        const commentIndex = post.comments.indexOf(comment);
        if (comment.usersWhoReacted && comment.usersWhoReacted.angry && comment.usersWhoReacted.angry.includes(currentUsername)) {
          comment.reactions.angry -= 1;
          comment.usersWhoReacted.angry = comment.usersWhoReacted.angry.filter(username => username !== currentUsername);
        } else {
          comment.reactions.angry += 1;
          if (!comment.usersWhoReacted) comment.usersWhoReacted = {};
          if (!comment.usersWhoReacted.angry) comment.usersWhoReacted.angry = [];
          comment.usersWhoReacted.angry.push(currentUsername);
        }
        angryButton.textContent = `😠 ${comment.reactions.angry}`;
        renderComments(post, postDiv);
      };
      commentReactionsDiv.appendChild(angryButton);
      const surprisedButton = document.createElement('button');
      surprisedButton.textContent = `😮 ${comment.reactions ? comment.reactions.surprised : 0}`;
      surprisedButton.onclick = function () {
        const currentUsername = room.party.client.username;
        const commentIndex = post.comments.indexOf(comment);
        if (comment.usersWhoReacted && comment.usersWhoReacted.surprised && comment.usersWhoReacted.surprised.includes(currentUsername)) {
          comment.reactions.surprised -= 1;
          comment.usersWhoReacted.surprised = comment.usersWhoReacted.surprised.filter(username => username !== currentUsername);
        } else {
          comment.reactions.surprised += 1;
          if (!comment.usersWhoReacted) comment.usersWhoReacted = {};
          if (!comment.usersWhoReacted.surprised) comment.usersWhoReacted.surprised = [];
          comment.usersWhoReacted.surprised.push(currentUsername);
        }
        surprisedButton.textContent = `😮 ${comment.reactions.surprised}`;
        renderComments(post, postDiv);
      };
      commentReactionsDiv.appendChild(surprisedButton);
    });
  }
}
