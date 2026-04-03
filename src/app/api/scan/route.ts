import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { exec } from 'child_process';
import util from 'util';
import path from 'path';
import { getPrisma } from '../../../lib/prisma';

const execPromise = util.promisify(exec);

export async function POST(req: Request) {
  let requestedUrl = '';
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    requestedUrl = url;

    // The python script now sits in the root of the 'web' folder for production deployment
    const scriptPath = path.join(process.cwd(), 'scanner.py');
    const pythonCommand = process.platform === 'win32' ? 'python' : 'python3';

    // Execute the python script. 
    const { stdout, stderr } = await execPromise(`${pythonCommand} "${scriptPath}" ${url}`);

    const cleanOutput = stdout.replace(/\x1b\[[0-9;]*m/g, '');
    const gradeMatch = cleanOutput.match(/FINAL GRADE: ([A-F])/);
    const grade = gradeMatch ? gradeMatch[1] : 'Unknown';

    try {
      await getPrisma().scanHistory.create({
        data: { url: requestedUrl, grade, output: cleanOutput }
      });
    } catch (dbErr) {
      console.error("Database connection error:", dbErr);
    }

    return NextResponse.json({ result: cleanOutput });
  } catch (error: any) {
    if (error.stdout) {
      const clean = error.stdout.replace(/\x1b\[[0-9;]*m/g, '');
      const gradeMatch = clean.match(/FINAL GRADE: ([A-F])/);
      const grade = gradeMatch ? gradeMatch[1] : 'Unknown';

      if (requestedUrl) {
        try {
          await getPrisma().scanHistory.create({
            data: { url: requestedUrl, grade, output: clean }
          });
        } catch (e) { }
      }
      return NextResponse.json({ result: clean });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
