\# AI Developer Agent \- Mandatory Technical Rules

\*\*ATTENTION AI DEVELOPER:\*\* You MUST adhere to the following rules without exception. Do not introduce new frameworks, libraries, or architectural patterns unless explicitly instructed to do so in a new story's acceptance criteria. Your goal is to build upon the existing foundation using only the approved technology stack.

\#\#\# 1\. Core Framework & Build Tool

\* \*\*FRAMEWORK:\*\* You \*\*MUST\*\* use \*\*React\*\* with \*\*Vite\*\*.  
\* \*\*LANGUAGE:\*\* You \*\*MUST\*\* use \*\*TypeScript\*\*.  
\* \*\*PROHIBITION:\*\* \*\*DO NOT\*\* use any other framework like Angular, Vue, Svelte, or Next.js. \*\*DO NOT\*\* use Create React App. All development must be within the established Vite PWA environment.

\#\#\# 2\. Styling

\* \*\*PRIMARY:\*\* You \*\*MUST\*\* use \*\*Tailwind CSS\*\* for all styling.  
\* \*\*COMPONENTS:\*\* You \*\*MUST\*\* use \*\*shadcn/ui\*\* patterns and components.  
\* \*\*PROHIBITION:\*\* \*\*DO NOT\*\* introduce other UI component libraries like Material UI or Bootstrap. \*\*DO NOT\*\* use custom CSS files for styling unless it is part of the established shadcn/ui theme architecture.

\#\#\# 3\. State Management & Data Fetching

\* \*\*SERVER STATE:\*\* You \*\*MUST\*\* use \*\*React Query (TanStack Query)\*\* for all server state management, caching, and data fetching.  
\* \*\*FORM STATE:\*\* You \*\*MUST\*\* use \*\*React Hook Form\*\* for managing all form state and validation.  
\* \*\*CLIENT STATE:\*\* For global client-side state, you \*\*MUST\*\* first use \*\*React's built-in Context API\*\*. If and only if a story's requirements prove this insufficient, you may use \*\*Zustand\*\*.  
\* \*\*PROHIBITION:\*\* \*\*DO NOT\*\* use Redux, MobX, or other state management libraries.

\#\#\# 4\. Routing

\* \*\*ROUTING:\*\* You \*\*MUST\*\* use \*\*React Router DOM\*\* for all client-side routing.  
\* \*\*PROHIBITION:\*\* \*\*DO NOT\*\* use any other routing library.

\#\#\# 5\. General

\* Follow all coding patterns, file structures, and testing strategies outlined in the \`architecture.md\` document.  
\* All code must be strictly typed and pass all ESLint and Prettier checks before completion.  
