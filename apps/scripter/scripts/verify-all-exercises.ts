import rawExercises from '../src/data/exercises.json';
import { executeCode } from '../src/services/compiler';
import type { Exercise } from '../src/types/exercise';

async function main() {
  const exercises = rawExercises as Exercise[];
  console.log(`\x1b[1m\x1b[36mRunning Verification Suite across ${exercises.length} Exercises...\x1b[0m\n`);

  let passed = 0;
  let failed = 0;

  for (const ex of exercises) {
    try {
      const result = await executeCode(ex.solutionCode, ex.mode, ex.language, ex.id);
      if (result.success) {
        passed++;
        console.log(`\x1b[32m✔\x1b[0m [${ex.category}] ${ex.title} (${result.executionTimeMs}ms)`);
      } else {
        failed++;
        console.error(`\x1b[31m✖\x1b[0m [${ex.category}] ${ex.title}`);
        console.error(result.stderr || result.stdout);
      }
    } catch (e: any) {
      failed++;
      console.error(`\x1b[31m✖\x1b[0m [${ex.category}] ${ex.title} crashed: ${e.message}`);
    }
  }

  console.log(`\n\x1b[1mSummary: \x1b[32m${passed} passed\x1b[0m, \x1b[31m${failed} failed\x1b[0m, ${exercises.length} total.`);

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
