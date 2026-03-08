const supabaseUrl = 'https://ytyafrywokjliplflcmt.supabase.co';
const supabaseKey = 'sb_publishable_qCgSZovSd-bO6CYpOPk_vg_p0xc92PZ';

// Renamed to 'sb' to avoid the global 'supabase' collision
const sb = supabase.createClient(supabaseUrl, supabaseKey);

async function fetchPosts() {
    const { data: posts, error } = await sb
        .from('posts')
        .select('*, comments(*)')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Fetch Error:", error);
        return;
    }

    const container = document.getElementById('blog-posts');
    container.innerHTML = posts.map(post => `
        <div class="post">
            <h2>${post.title}</h2>
            <p>${post.content}</p>
            
            <div class="comments-section">
                <h4>Comments</h4>
                ${post.comments && post.comments.length > 0 
                    ? post.comments.map(c => `<p><b>${c.username}</b>: ${c.body}</p>`).join('') 
                    : '<p style="opacity: 0.5;">No comments yet.</p>'}
                
                <form onsubmit="addComment(event, '${post.id}')">
                    <input type="text" placeholder="Username" id="user-${post.id}" required>
                    <input type="email" placeholder="Email" id="email-${post.id}" required>
                    <textarea placeholder="Your comment..." id="msg-${post.id}" required></textarea>
                    <button type="submit">Post Comment</button>
                </form>
            </div>
        </div>
    `).join('');
}

async function addComment(e, postId) {
    e.preventDefault();
    const username = document.getElementById(`user-${postId}`).value;
    const email = document.getElementById(`email-${postId}`).value;
    const body = document.getElementById(`msg-${postId}`).value;

    const { error } = await sb
        .from('comments')
        .insert([{ post_id: postId, username, email, body }]);

    if (error) {
        alert("Oops! " + error.message);
    } else {
        location.reload(); 
    }
}

fetchPosts();
