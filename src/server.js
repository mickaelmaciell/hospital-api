import 'dotenv/config'
import app from './index.js'

const port = process.env.PORT || 3333
app.listen(port, () => console.log(`✅ API on http://localhost:${port}`))
