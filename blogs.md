---
title: "Blogs"
# Optional - date will be used from filename if not set here.
# date: 2018-12-18 18:24:52 +0200
image: "https://github.com/AlertMend/AlertMend.io/blob/main/blogs/images/Troubleshooting_502.png?raw=true"
# Optional - date will be used from filename if not set here.
layout: post-list
permalink: /blogs/
---
<div class="row">
{% for post in site.posts %}
  <article class="post-list col-md-4 col-sm-6 d-flex">   
    <div class="card">
      <div class="card-banner">
        <p class="category-tag popular"><time datetime="{{ post.date | date: "%Y-%m-%d" }}">{{ post.date | date_to_long_string }}</time></p>
        <img class="banner-img" src='{{ post.image }}' alt='{{ post.title }}'>
      </div>
      <div class="card-body">
        <h2 class="blog-title py-1"><a href="{{ post.url }}">{{ post.title }}</a></h2>
      </div>
    </div>
    <!-- <img src="{{ post.image }}" alt="{{ post.title }}" class="img-fluid d-flex" />
      <h2><a href="{{ post.url }}">
        {{ post.title }}
      </a>
    </h2> -->
    <!-- <time datetime="{{ post.date | date: "%Y-%m-%d" }}">{{ post.date | date_to_long_string }}</time> -->
   
  </article>
{% endfor %}
</div>

