import { authMiddleware } from "@clerk/nextjs";
 
export default authMiddleware({
  publicRoutes: [
    '/', 
    '/home', 
    '/home/about', 
    '/home/researchers', 
    '/api/webhooks/clerk',
    '/join(.*)', 
    '/join/:sessionId',
    '/join/:sessionId/group'
  ],
  ignoredRoutes: [
    '/api/webhooks/clerk'
  ]
});
 
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};