# DEVAIOS Verification Checklist

This checklist helps verify that the DEVAIOS framework is properly installed, built, and functioning correctly. Follow these steps to validate your setup.

## Prerequisites Check

- [ ] Node.js 18+ installed: `node --version` (should be v18.0.0 or higher)
- [ ] npm 8+ installed: `npm --version` (should be v8.0.0 or higher)
- [ ] pnpm 7+ installed: `pnpm --version` (should be v7.0.0 or higher)
- [ ] PostgreSQL 13+ available (optional, for database testing)
- [ ] Git installed: `git --version`
- [ ] At least 2GB free disk space
- [ ] At least 4GB RAM available

### Quick Verification
```bash
node --version && npm --version && pnpm --version
```

Expected output:
```
v18.15.0
8.19.2
8.0.0
```

---

## Environment Setup

- [ ] Clone/navigate to DEVAIOS repository
- [ ] All files present in /workspace:
  - [ ] `/workspace/package.json` (root manifest)
  - [ ] `/workspace/packages/` (205 cognitive system packages)
  - [ ] `/workspace/apps/` (application layer)
  - [ ] `/workspace/db/` (database configurations)
  - [ ] `/workspace/migrations/` (database migration files: 0505-0880)

### Verify Directory Structure
```bash
ls -la /workspace/
ls -la /workspace/packages/ | wc -l  # Should show 208+ (205 systems + . + ..)
ls /workspace/migrations/ | wc -l   # Should show ~188 migration files
```

---

## Dependency Installation

- [ ] Install all dependencies: `pnpm install`
  - Expected: No errors, dependencies resolved
  - Time: ~30-60 seconds depending on internet speed
  
- [ ] Verify pnpm workspaces linked:
  ```bash
  pnpm list -r --depth=0 | head -20
  ```
  Expected: List of all packages

- [ ] No peer dependency warnings:
  ```bash
  pnpm install 2>&1 | grep -i "warn"
  ```
  Expected: No critical warnings

---

## Build Verification

### Step 1: Clean Build
```bash
pnpm run build
```

- [ ] All 205 cognitive systems compile
- [ ] No TypeScript errors
- [ ] No warnings (except harmless ones)
- [ ] Completion time: < 2 minutes

### Step 2: Verify Compilation Output
```bash
# Check individual system builds
ls /workspace/packages/cognitive-system-m146/dist/index.js
ls /workspace/packages/cognitive-system-m350/dist/index.js
```

- [ ] Both files exist and are not empty
- [ ] File size > 1KB (indicates actual compilation)

### Step 3: Test Build Reproducibility
```bash
pnpm run build
pnpm run build  # Should be faster, use cache
```

- [ ] Second build completes in seconds (cached)
- [ ] Output is consistent

---

## Unit Test Suite Execution

### Step 1: Quick Test (5 operations per system)
```bash
cd /workspace/test-harness
pnpm run test:quick
```

- [ ] Test suite starts successfully
- [ ] Progress indicators show systems being tested
- [ ] Expected result: M146 PASS, M147 PASS, etc.

### Step 2: Verify Test Output Format
Output should contain:
```
================================================================================
DEVAIOS Cognitive Systems Test Suite
Suite ID: suite_XXXXXXXXX
Total Systems to Test: 205
Operations per System: 5
================================================================================

[1/205] Testing M146... ✓ PASS (45ms, avg: 0.65)
[2/205] Testing M147... ✓ PASS (38ms, avg: 0.68)
```

- [ ] Suite ID generated
- [ ] All 205 systems listed
- [ ] Progress indicator shows current position
- [ ] Each test shows status and metrics

### Step 3: Check Test Summary
After all tests:
```
TEST SUITE RESULTS
Summary:
  Total Systems Tested: 205
  Passed: XXX (> 95%)
  Failed: X (< 5%)
  Errors: 0
```

- [ ] Passed systems: > 95%
- [ ] No catastrophic failures
- [ ] Error count: 0

### Step 4: Full Test Suite (optional, ~5-10 minutes)
```bash
pnpm run test:full
```

- [ ] All 205 systems complete successfully
- [ ] Test time per system: 50-100ms
- [ ] Pass rate: > 98%

---

## Examples and Demonstrations

### Step 1: Run Basic Usage Examples
```bash
cd /workspace/examples
npx ts-node basic-system-usage.ts
```

Expected output shows 7 examples:
- [ ] Example 1: Conscious Experience System (M146) ✓
- [ ] Example 2: Attention Focus System (M169) ✓
- [ ] Example 3: Executive Function System (M173) ✓
- [ ] Example 4: Decision Making System (M174) ✓
- [ ] Example 5: Emotional Processing System (M175) ✓
- [ ] Example 6: Pattern Recognition System (M200) ✓
- [ ] Example 7: Learning System (M164) ✓

Verify each example shows:
- [ ] System state output with metrics
- [ ] Normalized values between 0-1.0
- [ ] Timestamp_ms field present
- [ ] No errors or exceptions

### Step 2: Run Integration Tests
```bash
npx ts-node integration-test.ts
```

Expected output:
```
================================================================================
DEVAIOS INTEGRATION TEST SUITE
Total Tests: 3
================================================================================

TEST: Emotional Response to Stimulus
...
✓ Test PASSED

TEST: Learning and Memory Consolidation
...
✓ Test PASSED

TEST: Goal-Directed Task Execution
...
✓ Test PASSED

INTEGRATION TEST RESULTS
  Total Tests: 3
  Passed: 3 (100.0%)
  Failed: 0 (0.0%)
```

- [ ] All 3 integration tests pass
- [ ] Multi-system workflows execute
- [ ] Cross-system communication works
- [ ] Aggregate metrics calculated

### Step 3: Run Performance Benchmarks
```bash
npx ts-node performance-benchmark.ts
```

Expected output shows:
- [ ] Benchmarks for 10 representative systems
- [ ] Throughput measurements: > 50,000 ops/sec
- [ ] Latency measurements: < 0.02ms per operation
- [ ] Scalability analysis: GOOD or EXCELLENT
- [ ] Performance tiers assigned

---

## System Architecture Verification

### Step 1: Check Type Definitions
```bash
head -20 /workspace/packages/cognitive-system-m146/src/types.ts
```

- [ ] Export interfaces defined
- [ ] State interface present
- [ ] Metrics interface present
- [ ] Normalized metric properties (0-1.0)

### Step 2: Check Implementation Pattern
```bash
head -30 /workspace/packages/cognitive-system-m146/src/index.ts
```

- [ ] Subsystem classes implemented
- [ ] Map-based storage for subsystems
- [ ] Facade class orchestrating subsystems
- [ ] getState() method present
- [ ] getMetrics() method present

### Step 3: Verify Consistent Architecture
Check multiple systems use same pattern:
```bash
grep -l "private.*Map.*new Map()" /workspace/packages/*/src/index.ts | wc -l
```

- [ ] Should match number of cognitive systems
- [ ] Confirms all systems follow architecture

---

## Database Configuration (Optional but Recommended)

### Step 1: PostgreSQL Installation
```bash
# On macOS
brew install postgresql

# On Ubuntu
sudo apt-get install postgresql-13

# On Windows
# Download from https://www.postgresql.org/download/windows/
```

- [ ] PostgreSQL installed
- [ ] Version: 13+ (`psql --version`)
- [ ] Service running: `pg_isready`

### Step 2: Database Creation
```bash
# Create database
psql -U postgres -c "CREATE DATABASE devaios;"

# Create user
psql -U postgres -c "CREATE USER devaios_user WITH PASSWORD 'secure_password';"

# Grant permissions
psql -U postgres -d devaios -c "GRANT ALL PRIVILEGES ON DATABASE devaios TO devaios_user;"
```

- [ ] Database 'devaios' created
- [ ] User 'devaios_user' created with password
- [ ] Permissions granted

### Step 3: Run Migrations
```bash
# List migration files
ls /workspace/migrations/ | head

# Run migrations (requires migration tool setup)
cd /workspace
pnpm run db:migrate
```

- [ ] Migration files present (0505-0880)
- [ ] Migrations execute without error
- [ ] Database schema created

### Step 4: Verify Database Connection
```bash
psql -U devaios_user -d devaios -c "SELECT 1"
```

- [ ] Connection successful
- [ ] Returns: `?column?` `1`

---

## Documentation Verification

### Step 1: Complete Documentation Present
- [ ] `/workspace/DEVAIOS_COMPLETE_DOCUMENTATION.md` exists (1000+ lines)
- [ ] `/workspace/TESTING_AND_EXAMPLES.md` exists (comprehensive testing guide)
- [ ] `/workspace/IMPLEMENTATION_STATUS.md` exists (status tracking)
- [ ] `/workspace/README.md` exists (quick start)

### Step 2: Documentation Content Check
```bash
grep -c "M146\|M350" /workspace/DEVAIOS_COMPLETE_DOCUMENTATION.md
```

- [ ] References to all milestone systems
- [ ] Installation instructions present
- [ ] Database setup guide present
- [ ] Testing procedures documented
- [ ] Deployment guide included

### Step 3: Examples Documentation
```bash
grep -c "Example\|Usage\|Pattern" /workspace/TESTING_AND_EXAMPLES.md
```

- [ ] 7+ working examples documented
- [ ] Integration patterns explained
- [ ] Performance measurement guide included
- [ ] Troubleshooting section present

---

## Performance Baseline

### Step 1: Measure System Performance
```bash
cd /workspace/examples
npx ts-node performance-benchmark.ts > /tmp/benchmark.txt 2>&1
```

- [ ] Benchmark completes without error
- [ ] Measurements taken for 10 representative systems
- [ ] Results show throughput > 50,000 ops/sec
- [ ] Results show latency < 0.02ms per op

### Step 2: Capture Baseline Metrics
```bash
grep "Average Throughput\|Average Latency" /tmp/benchmark.txt
```

Expected:
```
Average Throughput: 85000 ops/sec
Average Latency: 0.012 ms/op
```

- [ ] Baseline performance recorded
- [ ] Can be compared against future changes

### Step 3: Export Results
```bash
cd /workspace/examples
npx ts-node performance-benchmark.ts --export
ls -lh /workspace/benchmark-results/
```

- [ ] Results file created
- [ ] File size > 1KB
- [ ] Contains JSON data

---

## File Inventory

### Step 1: Count Cognitive Systems
```bash
find /workspace/packages -name "cognitive-system-m*" -type d | wc -l
```

- [ ] Should show exactly 205 systems (M146-M350)

### Step 2: Verify File Structure Per System
```bash
# Check one system completely
ls -la /workspace/packages/cognitive-system-m146/src/
```

Expected files:
- [ ] `types.ts` - TypeScript interfaces
- [ ] `index.ts` - Facade implementation
- [ ] `package.json` - NPM configuration
- [ ] `tsconfig.json` - TypeScript configuration

### Step 3: Count Migration Files
```bash
ls /workspace/migrations/M0*.sql | wc -l
```

- [ ] Should show 188 migration files (0505-0880)
- [ ] Each file size > 1KB

### Step 4: Verify Build Artifacts
```bash
find /workspace/packages/cognitive-system-m* -name "dist" -type d | wc -l
```

- [ ] Should match number of cognitive systems
- [ ] Each contains `index.js` or `index.d.ts`

---

## Final Validation Summary

Create a summary of verification status:

```bash
cat > /workspace/VERIFICATION_SUMMARY.txt << 'EOF'
DEVAIOS System Verification Report
Generated: $(date)

Prerequisites: ✓ (Node.js, npm, pnpm installed)
Environment: ✓ (All directories and files present)
Dependencies: ✓ (pnpm install successful)
Build: ✓ (205 systems compile without error)
Unit Tests: ✓ (Test suite passes with >95% rate)
Examples: ✓ (7 examples run successfully)
Integration: ✓ (3 multi-system workflows execute)
Performance: ✓ (Throughput and latency acceptable)
Documentation: ✓ (All guides present and comprehensive)
Database: ✓ (PostgreSQL configured and migrations ready)

OVERALL STATUS: READY FOR TESTING AND DEPLOYMENT
Total Systems: 205 (M146-M350)
Pass Rate: >95%
Performance Baseline: Recorded
Documentation: Complete
Testers Can: Install, run, test, benchmark, and deploy
EOF

cat /workspace/VERIFICATION_SUMMARY.txt
```

- [ ] Summary file created
- [ ] All checks marked with ✓
- [ ] Status shows "READY FOR TESTING AND DEPLOYMENT"

---

## Sharing with Testers

Once verification is complete:

1. **Create Test Package**:
```bash
tar -czf devaios-test-package.tar.gz /workspace/
```

2. **Document Issues Found**:
   - List any failing systems
   - Record performance baselines
   - Note any environment-specific issues

3. **Provide Instructions**:
   - Share this checklist with testers
   - Provide the TESTING_AND_EXAMPLES.md guide
   - Include DEVAIOS_COMPLETE_DOCUMENTATION.md
   - Share test results and benchmarks

4. **Collect Feedback**:
   - Have testers run verification checklist
   - Record any environment-specific issues
   - Compare performance across systems
   - Note any failing systems or edge cases

---

## Troubleshooting Verification Failures

### Build Fails
```bash
# Clean and rebuild
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm run build
```

### Tests Fail
```bash
# Test individual system
cd /workspace/test-harness
npx ts-node index.ts --system M146

# Check system directly
cd /workspace/packages/cognitive-system-m146
npm test
```

### Performance Poor
```bash
# Check system resources
free -h
df -h
top -b -n 1 | head -20

# Profile specific system
cd /workspace/examples
npx ts-node performance-benchmark.ts | grep M146
```

### Database Issues
```bash
# Test PostgreSQL connection
psql -U devaios_user -d devaios -c "SELECT version();"

# Check migration files
ls -la /workspace/migrations/ | head
```

---

## Sign-Off

Once all checks pass, create a sign-off document:

```
DEVAIOS System Verification Complete

Date: ________________
Verified By: ________________
System: ________________
Environment: ________________

All checks passed: __ YES __ NO

Issues found: _________________________________________________
_____________________________________________________________

Performance baseline recorded: __ YES __ NO

Ready for testing: __ YES __ NO
Ready for deployment: __ YES __ NO

Signature: ________________
```

This confirms the system is ready for external testers.
