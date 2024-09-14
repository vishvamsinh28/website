# Save this script as report-coverage.sh
#!/bin/bash

# Generate coverage report
npm test --coverage --coverageReporters=json

# Extract and format the coverage report
REPORT_FILE="coverage/coverage-summary.json"
REPORT=$(jq '.totalStatements.pct, .totalBranches.pct, .totalFunctions.pct, .totalLines.pct' $REPORT_FILE | awk '{print $1}')
COVERAGE_FORMAT="Coverage Report:
- Statements: ${REPORT[0]}%
- Branches: ${REPORT[1]}%
- Functions: ${REPORT[2]}%
- Lines: ${REPORT[3]}%"

# Post report as comment on PR
echo "$COVERAGE_FORMAT" > coverage-report.txt
