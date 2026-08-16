# SpendWise — Smart Expense Tracker

Interview-ready full-stack project matching the four product/engineering outcomes on the resume.

## Live demo
The public Vercel demo is the browser-facing experience. The repository also contains the backend and measurement scaffolding.

## Four metrics

1. **1,000+ TPS:** distributed transaction-ingestion architecture with a k6 load-test plan targeting 1,100 requests/sec.
2. **20% categorization efficiency:** baseline vs optimized manual processing time is instrumented; the demo shows the experiment methodology.
3. **40% bug-resolution improvement:** incident records compare baseline vs observability-assisted MTTR and calculate the reduction.
4. **30% budget visibility:** a task-based user-study model compares baseline vs dashboard-enabled visibility.

### Important
The live browser app contains demo/evidence data so an interviewer can see the full measurement story. Those figures are **not claims of production execution** until you replace them with your own benchmark, experiment, and uptime evidence.

## Architecture

Client -> API Gateway -> transaction/budget/categorization/analytics services
-> event bus -> workers -> PostgreSQL + Redis
-> OpenTelemetry/CloudWatch/Prometheus/Grafana

## Local backend
```bash
cd backend
python -m venv .venv
# activate venv
pip install -r requirements.txt
uvicorn main:app --reload --port 8080
```

## Load testing
```bash
BASE_URL=http://localhost:8080 k6 run scripts/load_test.js
```

## Interview
Start with the live product, then show the engineering metrics page, then open the backend/API and explain how each metric is measured.
