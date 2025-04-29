
function renderPost(post){
  const latestPostsContainer = document.getElementById("latest-posts");

  const card = document.createElement("div");
  card.className = "blog-card";
  
  const thumbnail = document.createElement("div");
  thumbnail.className = "blog-thumbnail";
  thumbnail.style.backgroundImage=`url(${post.thumbnail})`
   
  const details = document.createElement("div");
  details.className = "blog-details";

  const title = document.createElement("p");
  title.className = "title bl lg";
  title.textContent = post.title;

  const description = document.createElement("p");
  description.className = "description bl md";
  description.textContent = post.description;
    

  const actions = document.createElement("div");
  actions.className = "blog-actions bl sm d-flex";

    const views = document.createElement("div");
    views.className = "views";
    views.innerHTML = `<span class="material-symbols-outlined">visibility</span>${formatNumber(post.views)}`;

    const likes = document.createElement("div");
    likes.className = "likes";
    likes.innerHTML = `<span class="material-symbols-outlined">favorite</span>${formatNumber(post.likes)}`;

    const comment = document.createElement("div");
    comment.className = "comments";
    comment.innerHTML = `<span class="material-symbols-outlined">chat_bubble</span>${formatNumber(post.comments)}`;
    comment.dataset.title = post.title;

    const share = document.createElement("div");
    share.className = "share";
    share.innerHTML = `<a href="#"><span class="material-symbols-outlined">share</span></a> ${formatNumber(post.shares)}`;  
   
    const readmore = document.createElement("div");
    readmore.className = "readmore";
    readmore.innerHTML = `<span class="material-symbols-outlined">arrow_forward</span>`;
    
    likes.addEventListener('click', async () => {
  const icon = likes.querySelector('span');
  const isLiked = likes.classList.contains('liked');

  if (isLiked) {
    // Remove like
    post.likes = parseInt(post.likes, 10) - 1;
    await updateCount(post.title, { likes: -1 });
    likes.classList.remove('liked');
    icon.classList.remove('filled');
    icon.classList.add('pop-out');
  } else {
    // Add like
    await updateCount(post.title, { likes: 1 });
    post.likes = parseInt(post.likes, 10) + 1;
    likes.classList.add('liked');
    icon.classList.add('filled');
    icon.classList.add('pop-in');
  }

  // Update the likes count after the toggle
  likes.innerHTML = `<span class="material-symbols-outlined ${likes.classList.contains('liked') ? 'filled' : ''}">favorite</span>${formatNumber(post.likes)}`;
});
comment.addEventListener("click", (e) => {
      e.preventDefault();
      openCommentModal(comment.dataset.title);
      post.comments=parseInt(post.comments, 10)+1;
      comment.innerHTML = `<span class="material-symbols-outlined">chat_bubble</span>${formatNumber(post.comments)}`;
    });
    share.addEventListener('click', async (e) => {
  e.preventDefault();

  try {
    if (navigator.share) {
      await navigator.share({
        title: post.title,
        text: post.description,
        url: post.link,
      });
      console.log('Shared successfully!');
      post.shares = parseInt(post.shares, 10) + 1;
      updateCount(post.title, { shares: 1 });
      share.innerHTML = `<a href="#"><span class="material-symbols-outlined">share</span></a> ${post.shares}`;
    } else {
      await navigator.clipboard.writeText(post.link);
      alert('Link copied to clipboard!');
      post.shares = parseInt(post.shares, 10) + 1;
      updateCount(post.title, { shares: 1 });
      share.innerHTML = `<a href="#"><span class="material-symbols-outlined">share</span></a> ${post.shares}`;
    }
  } catch (error) {
    console.error('Error sharing', error);
  }

  share.innerHTML = `<a href="#"><span class="material-symbols-outlined">share</span></a> ${formatNumber(post.shares)}`;
});
readmore.addEventListener('click', () => {
      window.location.href = post.link;
      updateCount(post.title, {
        views:1
      });
      post.views = parseInt(post.views, 10) + 1
      views.innerHTML = `<span class="material-symbols-outlined">visibility</span>${formatNumber(post.views)}`;
    });
    
    details.appendChild(title);
    details.appendChild(description);

    actions.appendChild(views);
    actions.appendChild(likes);
    actions.appendChild(comment);
    actions.appendChild(share);
    actions.appendChild(readmore);

    card.appendChild(thumbnail);
    card.appendChild(details);
    card.appendChild(actions);

    latestPostsContainer.appendChild(card);
}
async function updatePostActions(post){
  const count = await getCount(post.title);
  const commentCount = await getCommentCount(post.title);
  post.likes = (count.likes);
      post.views = (count.views);
      post.shares = (count.shares);
      post.comments = (commentCount);
}

function openCommentModal(title) {
  const modal = document.getElementById("comment-modal");
  const giscusContainer = document.getElementById("giscus-container");
  const closeButton = document.querySelector('#close-modal');
  
  modal.style.display = "block";
  
  giscusContainer.innerHTML = '';
  closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  const script = document.createElement("script");
  script.src = "https://giscus.app/client.js";
  script.setAttribute("data-repo", "weblink-max/GiscusDB");
  script.setAttribute("data-repo-id", "R_kgDOOgV2vA");
  script.setAttribute("data-category", "General");
  script.setAttribute("data-category-id", "DIC_kwDOOgV2vM4CpgUH");
  script.setAttribute("data-mapping", "specific");
  script.setAttribute("data-term", title);
  script.setAttribute("data-strict", "0");
  script.setAttribute("data-reactions-enabled", "1");
  script.setAttribute("data-emit-metadata", "1");
  script.setAttribute("data-input-position", "top");
  script.setAttribute("data-theme", "dark");
  script.setAttribute("data-lang", "en");
  script.setAttribute("data-loading", "lazy");
  script.setAttribute("crossorigin", "anonymous");
  script.setAttribute("async", "true");
  
  giscusContainer.appendChild(script);
}
function addComment() {
  const blogContent = document.querySelector('.blog-content');  // Adjust the selector based on your HTML structure

  // Ensure this code runs only on the blog page
  if (!blogContent) return; // This ensures it only runs if the blog content exists
  
  // Create a container for the Giscus comment section at the bottom of the blog content
  const giscusContainer = document.createElement('div');
  giscusContainer.id = 'giscus-container';  // ID for the container
  giscusContainer.style.marginTop = '32px'; // Optional: Add some margin above the comment section
  blogContent.appendChild(giscusContainer);  // Append it to the blog content
  
  // Clear any existing content within the container (just in case it was added earlier)
  giscusContainer.innerHTML = '';

  // Create the script tag to load Giscus
  const script = document.createElement("script");
  script.src = "https://giscus.app/client.js";
  script.setAttribute("data-repo", "weblink-max/GiscusDB");
  script.setAttribute("data-repo-id", "R_kgDOOgV2vA");
  script.setAttribute("data-category", "General");
  script.setAttribute("data-category-id", "DIC_kwDOOgV2vM4CpgUH");
  script.setAttribute("data-mapping", "title");  // Uses title for mapping to the comment thread
  script.setAttribute("data-strict", "0");
  script.setAttribute("data-reactions-enabled", "1");
  script.setAttribute("data-emit-metadata", "0");
  script.setAttribute("data-input-position", "top");
  script.setAttribute("data-theme", "light");
  script.setAttribute("data-lang", "en");
  script.setAttribute("data-loading", "lazy");
  script.setAttribute("crossorigin", "anonymous");
  script.setAttribute("async", "true");

  // Append the script tag to the container to load the Giscus comments
  giscusContainer.appendChild(script);
}
async function getCommentCount(title) {
  let response = await new Promise((resolve, reject) => {
    const giscusContainer = document.createElement("div");
    //giscusContainer.classList.add("hidden2")
    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", "weblink-max/GiscusDB");
    script.setAttribute("data-repo-id", "R_kgDOOgV2vA");
    script.setAttribute("data-category", "General");
    script.setAttribute("data-category-id", "DIC_kwDOOgV2vM4CpgUH");
    script.setAttribute("data-mapping", "specific");
    script.setAttribute("data-term", title);
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "1");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", "dark");
    script.setAttribute("data-lang", "en");
    script.setAttribute("data-loading", "lazy");
    script.setAttribute("crossorigin", "anonymous");
    script.setAttribute("async", "true");

    // Append script to giscusContainer
    giscusContainer.appendChild(script);
    document.body.appendChild(giscusContainer);

    // Add a message listener to get the comment count from Giscus
    function handleMessage(event) {
      if (event.origin !== 'https://giscus.app') return;

      const giscusData = event.data.giscus;
      if (giscusData && giscusData.discussion) {

        // After receiving the data, remove the event listener to stop further listening
        window.removeEventListener('message', handleMessage);
        giscusContainer.remove()
        // Resolve with the comment count
        resolve(giscusData.discussion.totalCommentCount);
      }
    }

    // Listen for the message event to fetch comment count
    window.addEventListener('message', handleMessage);

    // Timeout in case of failure to fetch the data within a reasonable time
    setTimeout(() => {
      window.removeEventListener('message', handleMessage);
      reject('Unable to retrieve comment count within the timeout period');
    }, 120000); // 2 minute timeout
  });
  console.log(response)
  if(typeof(response)!="number"){
    return 0
  }else{
    return response
  }
  
}
async function getCount(title) {
  const token = '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';
  const repoOwner = 'weblink-max';
  const repoName = 'Infinity-Point';
  const filePath = 'backend.json';
  const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;
  
  const res = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();
  const json = JSON.parse(atob(data.content));
  
  if(!json[title]){
    updateCount(title,{
      views: 0,
      likes: 0,
      shares: 0
    }).then((res)=>{
      console.log("title added to db!")
    }).catch((e)=>{
      console.error("failed to add to db!")
    })
    
  }else{
    console.log("title found in db!")
  }
  
  return json[title];
}
async function getBlogs(){
  const token = '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';
    const repoOwner = 'weblink-max';
    const repoName = 'Infinity-Point';
    const filePath = 'blogs.json';
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

    const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    const json = JSON.parse(atob(data.content));

    if (!json) {
        console.error('JSON not found');
        return null;
    }else{
      console.log(json.blogs)
    }

    return json.blogs;
}
async function updateCount(title, countUpdate) {
    const token = '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'; // (for real apps, store securely)
    const repoOwner = 'weblink-max';
    const repoName = 'Infinity-Point';
    const filePath = 'backend.json';
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

    // Step 1: Fetch the file content
    const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    const sha = data.sha;

    // Browser JS: decode base64 using atob()
    const decodedContent = atob(data.content);
    const json = JSON.parse(decodedContent);

    // Step 2: Update the counts or add new title if not found
    if (!json[title]) {
        console.warn('Title not found. Adding new title...');
        json[title] = {
            likes: 0,
            views: 0,
            shares: 0,
            comments:0
        };
    }

    // Update counts if provided
    if (typeof countUpdate.likes === 'number') {
        json[title].likes = Math.max(0, json[title].likes + countUpdate.likes);
    }
    if (typeof countUpdate.views === 'number') {
        json[title].views = Math.max(0, json[title].views + countUpdate.views);
    }
    if (typeof countUpdate.shares === 'number') {
        json[title].shares = Math.max(0, json[title].shares + countUpdate.shares);
    }

    // Step 3: Push updated content back to GitHub
    const updatedContent = btoa(JSON.stringify(json, null, 2)); // Browser JS: encode base64 using btoa()

    await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: `Updated counts for ${title}`,
            sha,
            content: updatedContent
        })
    });

    console.log('Update successful!');
}
function formatNumber(num) {
    if (num >= 1_000_000_000) {
        return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
    }
    if (num >= 1_000_000) {
        return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1_000) {
        return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
}

async function renderHome(){
  const posts = await getBlogs()
  for(const post of posts){
    await updatePostActions(post)
    renderPost(post)
    
    const content = document.querySelector(".content")
    content.classList.remove("hidden")
    
    const skeleton = document.querySelector(".card")
    skeleton.classList.add("hidden")
  }
}

if(window.location.pathname !="/index.html"){
  addComment()
  
}else{
  renderHome()
                           }
