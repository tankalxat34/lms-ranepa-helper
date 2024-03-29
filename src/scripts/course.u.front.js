function isActiveLi(pathname) {
  return new URL(window.location.href).pathname === pathname ? "active active_tree_node" : "";
}

const htmlLi = `<li data-key="helper" class="nav-item" role="none" data-forceintomoremenu="false">
<a role="menuitem" class="nav-link  <% activeClass %>" href="<% href %>" tabindex="-1"><% text %></a>
</li>`;
const url = new URL(window.location.href);
const searchParams = url.searchParams;
const courseInfo = getFromSessionStorage("staticState");
const courseId =
  courseInfo?.course?.id ||
  searchParams.get("id") ||
  searchParams.get("courseId") ||
  searchParams.get("courseid");
const courseNavbar = document.querySelector("nav > ul[role='menubar'].nav.more-nav.nav-tabs");

const liContents = [
  {
    href: `${url.origin}/course/resources.php?id=${courseId}`,
    text: `Ресурсы`,
    activeClass: isActiveLi("/course/resources.php"),
  },
  {
    href: `${url.origin}/course/recent.php?id=${courseId}`,
    text: `Последние действия`,
    activeClass: isActiveLi("/course/recent.php"),
  },
  {
    href: `${url.origin}/mod/quiz/index.php?id=${courseId}`,
    text: `Тесты`,
    activeClass: isActiveLi("mod/quiz/index.php"),
  },
];

liContents.forEach((obj) => {
  courseNavbar.appendChild(new HTMLComp(htmlLi, obj).html);
});
