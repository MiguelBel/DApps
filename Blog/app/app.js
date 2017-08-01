var address = findGetParameter('address');
var is_publish_page = findGetParameter('publish');

var converter = new showdown.Converter();

if(address == undefined) {
  contract_selection = new ContractSelection();
  contract_selection.render();
} else if(is_publish_page) {
  publish = new Publish();
  publish.render();
} else {
  show_posts = new ShowPosts();
  show_posts.render();
}
