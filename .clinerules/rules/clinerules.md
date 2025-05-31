---
trigger: manual
---

# Cline Rules

## Stack
- **Vite** - Build tool, no exceptions
- **Radix UI** - Primitives 
- **ShadCN** - Component library
- **TypeScript** - Everything. No JavaScript files.
- **dotenv** - Environment variables in root `.env` file
- Bun. We use bun for package management whenever we can. 

## Core Principles

### 1. Modular or Die
- Every feature is a module
- No god files
- No giant app.tsx with all the logic
- app.tsx is a crossroads ONLY - wiring, not implementation
- Separation of concerns is sacred

### 2. Documentation is Not Optional
- `cartography/` folder maintains complete code index
- Latest cartography file tracks:
  - Full file paths
  - Module structure
  - What each module does
  - How modules connect
- README.md for user/admin features
- Between sprints: analyze and update cartography

### 3. Development Rules
- WebSockets when needed, kill when problematic
- No API gymnastics to other languages
- Keep it simple, keep it TypeScript
- If changing one thing breaks two things, your architecture sucks

### 4. File Structure
```
project-root/
├── .env                    # Environment variables
├── src/
│   ├── app.tsx            # Crossroads only - minimal code
│   ├── modules/           # All features live here
│   │   ├── module-a/
│   │   ├── module-b/
│   │   └── module-c/
│   └── ...
├── cartography/           # Code documentation
│   └── latest.md          # Current system map
└── README.md              # User/admin documentation
```

### 5. Module Rules
- Each module is self-contained
- Clear interfaces between modules
- No cross-contamination
- Document dependencies explicitly
- Test in isolation

### 6. Code Quality
- TypeScript strict mode
- No `any` types unless absolutely necessary
- Proper error handling
- Clean imports/exports
- No circular dependencies

### 7. Sprint Workflow
1. Build features in modules
2. Update cartography as you go
3. Between sprints: audit and update documentation
4. Keep README current with user-facing changes

## Remember
- Modular means modular
- Document means document
- Cross the streams = straight to hell