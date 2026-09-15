export const stripExtensionAttrsScript = `(function(){
  var attributes=["bis_skin_checked"];
  function stripNode(node){
    if(!node||node.nodeType!==1||!node.removeAttribute)return;
    for(var i=0;i<attributes.length;i+=1){
      if(node.hasAttribute(attributes[i]))node.removeAttribute(attributes[i]);
    }
  }
  function stripTree(root){
    stripNode(root);
    if(!root||!root.querySelectorAll)return;
    var nodes=root.querySelectorAll("["+attributes.join("],[")+"]");
    for(var i=0;i<nodes.length;i+=1)stripNode(nodes[i]);
  }
  stripTree(document.documentElement);
  var observer=new MutationObserver(function(mutations){
    for(var i=0;i<mutations.length;i+=1){
      var mutation=mutations[i];
      if(mutation.type==="attributes")stripNode(mutation.target);
      var added=mutation.addedNodes;
      for(var j=0;j<added.length;j+=1)stripTree(added[j]);
    }
  });
  observer.observe(document.documentElement,{
    subtree:true,
    childList:true,
    attributes:true,
    attributeFilter:attributes
  });
  window.addEventListener("load",function(){
    stripTree(document.documentElement);
    window.setTimeout(function(){observer.disconnect();},1500);
  });
})();`;
