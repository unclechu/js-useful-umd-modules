<%
  var amd_code = '';
  if (amd.length > 0) {
    amd_code = [];
    amd.forEach(function (item) { amd_code.push("'" + item + "'"); });
    amd_code = '[' + amd_code.join(', ') + '] , ';
  }

  var cjs_code = '!';
  if (cjs.length > 0) {
    cjs_code = [];
    cjs.forEach(function (item) { cjs_code.push("require('" + item + "')"); });
    cjs_code = cjs_code.join(', ');
  }

  var global_code = '!';
  if (global.length > 0) {
    global_code = [];
    global.forEach(function (item) { global_code.push('root.' + item); });
    global_code = global_code.join(', ');
  }

  var param_code = '';
  if (param.length > 0) {
    param_code = '(' + param.join(', ') + ')';
  }
%>let
<%= indent %>init = (root, factory) !->
<%= indent %><%= indent %>if typeof define is \function and define.amd
<%= indent %><%= indent %><%= indent %>define <%= amd_code %>factory
<%= indent %><%= indent %>else if typeof exports is \object
<%= indent %><%= indent %><%= indent %>module.exports = factory<%= cjs_code %>
<%= indent %><%= indent %>else
<%= indent %><%= indent %><%= indent %>root.<%= namespace %> = factory<%= global_code %>
<%= indent %>init this , <%= param_code %>->
<%= indent %><%= indent %><% var c = getContentsWithIndent(2); %><%= c %>
<%= indent %><%= indent %><%= exports %>
