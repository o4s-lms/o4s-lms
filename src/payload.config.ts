// storage-adapter-import-placeholder
//import { postgresAdapter } from '@payloadcms/db-postgres';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { nodemailerAdapter } from '@payloadcms/email-nodemailer';
import { s3Storage } from '@payloadcms/storage-s3';

import sharp from 'sharp'; // sharp-import
import path from 'path';
import { buildConfig } from 'payload';
import { fileURLToPath } from 'url';

import { Categories } from '@/collections/Posts/Categories';
import { Media } from '@/collections/Media';
import { Pages } from '@/collections/Pages';
import { Posts } from '@/collections/Posts';
import { Courses } from '@/collections/Courses';
import { Modules } from '@/collections/Courses/Modules';
import { Lessons } from '@/collections/Courses/Lessons';
import { LessonsContent } from '@/collections/Courses/Lessons/LessonContent';
import { Enrollments } from '@/collections/Courses/Enrollments';
import { CourseProgress } from '@/collections/Courses/Progress';
import { LessonProgress } from '@/collections/Courses/Progress/LessonProgress';
import { Achievements } from '@/collections/Courses/Progress/Achievements';
import { Points } from '@/collections/Courses/Progress/Points';
import { Badges } from '@/collections/Courses/Progress/Badges';
import { Favorites } from '@/collections/Users/Favorites';
import { Transactions } from '@/collections/Transactions';
import { Announcements } from '@/collections/Communications/Announcements';
import { Notifications } from '@/collections/Communications/Notifications';
import { Newsletter } from '@/collections/Newsletter';
import { Users } from '@/collections/Users';
import { Avatar } from '@/collections/Users/Avatar';
import { SupportTickets } from '@/collections/Communications/Support';
import { FooterPt } from '@/Footer/pt/config';
import { FooterEn } from '@/Footer/en/config';
import { FooterFr } from '@/Footer/fr/config';
import { FooterEs } from '@/Footer/es/config';
import { Header } from '@/Header/config';
import { plugins } from '@/plugins';
import { defaultLexical } from '@/fields/defaultLexical';
import { getServerSideURL } from '@/utilities/getURL';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeLogin` statement on line 15.
      beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeDashboard` statement on line 15.
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  email: nodemailerAdapter({
    defaultFromAddress: 'info@o4s-lms.com',
    defaultFromName: 'O4S - LMS',
    // Nodemailer transportOptions
    transportOptions: {
      host: process.env.SMTP_HOST,
      port: 2525,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
  }),
  /**db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),*/
  db: mongooseAdapter({
    // Mongoose-specific arguments go here.
    // URL is required.
    url: process.env.DATABASE_URI,
  }),
  collections: [
    Pages,
    Posts,
    Media,
    Categories,
    Courses,
    Enrollments,
    Modules,
    Lessons,
    LessonsContent,
    CourseProgress,
    LessonProgress,
    Achievements,
    Points,
    Badges,
    Favorites,
    Transactions,
    Announcements,
    Notifications,
    Newsletter,
    Users,
    Avatar,
    SupportTickets,
  ],
  cors: [getServerSideURL()].filter(Boolean),
  csrf: [getServerSideURL()].filter(Boolean),
  globals: [Header, FooterPt, FooterEn, FooterFr, FooterEs],
  plugins: [
    ...plugins,
    // storage-adapter-placeholder
    s3Storage({
      collections: {
        media: true,
        avatar: true,
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: process.env.CLOUDFLARE_SECRET_KEY_ID || '',
          secretAccessKey: process.env.CLOUDFLARE_KEY_SECRET || '',
        },
        region: 'auto',
        // ... Other S3 configuration
      },
    }),
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
});
