<!-- install ejs -->
npm install ejs
<!-- app.set('view engine', 'ejs'); -->

<!-- then use render instead res.sendFile -->
<!-- res.render('index) -->

<!-- <%  javascript code %> -->
<!-- <%  =variable %> --> to print the value of the variable

<%const name="mario" %>

<!-- outputting -->
<% =name %>


<!-- now we wan to pass the data from app.js to ejs template -->

res.render('index',{title:"heallow"});   //from handler to ejs template
<%=title %>

<!-- passing multiple data from handler to ejs template -->

const blogs=[{title:"yashi",desc:"gg"},{title:"yashi",desc:"gg"}]
res.render('index',{blogs:blogs});
<% if (blogs.length>0){ %>
   <% blogs.foreach(blog=>{
    <h3><%= blog.title %></h3>
   })%>
   <%}%>


   <!-- including partials -->

   <%- include('./partials/nav.ejs')%>  //- is hypher sign 


   