# **Tax Genius Platform \- Final Technology Stack**

## **Core Framework**

* **Next.js 14** (App Router) \- React framework with SSR/SSG  
* **React 18** \- UI library  
* **TypeScript** \- Type-safe JavaScript

## **Styling & UI**

* **Tailwind CSS** \- Utility-first CSS framework  
* **Shadcn/ui** \- Component library built on Radix UI  
* **OKLCH Color System** \- Modern perceptually uniform color space  
* **Lucide React** \- Icon library

## **Authentication & Security**

* **Lucia Auth** \- Authentication library  
* **Session-based auth with cookies**  
* **node:crypto** \- Built-in encryption for SSN/PII data  
* **scrypt** \- Password hashing (built into Node.js crypto)

## **Database & Storage**

* **PostgreSQL** \- Relational database  
* **Prisma** \- Type-safe ORM and database toolkit  
* **Redis** \- Caching and session storage  
* **Cloudflare R2** \- Object storage (S3-compatible)

## **Real-time & Communication**

* **Socket.io** \- Real-time notifications and chat  
* **SendGrid** \- Transactional email service

## **Payment Processing**

* **Square** \- Payment gateway and merchant services  
* **Square Checkout** \- Hosted payment forms

## **PWA Support**

* **next-pwa** \- Progressive Web App plugin for Next.js  
* **manifest.json** \- PWA configuration

## **Testing**

* **Jest** \- Unit testing framework  
* **Playwright** \- E2E testing

## **Development Tools**

* **ESLint** \- Code linting  
* **Prettier** \- Code formatting

## **Deployment & Infrastructure**

* **GitHub Actions** \- CI/CD pipeline  
* **PM2** \- Node.js process manager  
* **Docker** \- Containerization  
* **Custom VPS** \- Self-hosted on 72.60.28.175

## **Utility Libraries**

* **date-fns** \- Date manipulation  
* **zod** \- Schema validation  
* **next-themes** \- Theme management  
* **react-hook-form** \- Form handling

## **Architecture Patterns**

* **Server Components (RSC)** \- Performance optimization  
* **Server Actions** \- Mutations  
* **Service layer pattern** \- /lib/db/ structure

