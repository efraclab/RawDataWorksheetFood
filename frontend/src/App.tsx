import { useState, useCallback, useEffect } from 'react';
import './index.css';

import RegistrationSearchTool from './components/RegistrationSearchTool';
import FormPreview from './components/FormPreview';
import { 
  fetchSamples, 
  fetchInstruments,
  fetchChemicals,
  fetchStandards,
  fetchColumns
} from './services/api'; 
import { type SampleData } from './models/SampleData';
import { type Instrument } from './models/Instrument'; 
import { type Chemical } from './models/Chemical';
import { type Standard } from './models/Standard';
import type { Column } from './models/Column';

function App() {
  const [registrationNo, setRegistrationNo] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [reportData, setReportData] = useState<SampleData[] | null>(null);
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [chemicals, setChemicals] = useState<Chemical[]>([]);
  const [standards, setStandards] = useState<Standard[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [isReferenceDataLoading, setIsReferenceDataLoading] = useState(true);
  const [referenceDataError, setReferenceDataError] = useState<string | null>(null);


  useEffect(() => {
    const loadReferenceData = async () => {
      setIsReferenceDataLoading(true);
      setReferenceDataError(null);
      
      try {
        const [inst, chem, std, col] = await Promise.all([
          fetchInstruments(),
          fetchChemicals(),
          fetchStandards(),
          fetchColumns()
        ]);

        setInstruments(inst);
        setChemicals(chem);
        setStandards(std);
        setColumns(col);
      } catch (e: any) {
        console.error("Reference Data Fetch Error:", e);
        setReferenceDataError(`Failed to load reference data: ${e.message}`);
      } finally {
        setIsReferenceDataLoading(false);
      }
    };

    loadReferenceData();
  }, []);


  const fetchReport = useCallback(async (regNoToFetch: string) => {
    if (!regNoToFetch) {
      setReportError("Please enter a registration number to view the report.");
      setReportData(null);
      return;
    }

    setIsReportLoading(true);
    setReportError(null);
    setReportData(null);
    
    try {
      const data = await fetchSamples(regNoToFetch); 
      
      if (data && Array.isArray(data) && data.length > 0) {
        setReportData(data);
        setError(null); 
      } else {
        setReportData(null); 
        setReportError(null); 
      }
    } catch (e: any) {
      console.error("Report Fetch Error:", e);
      setReportError(`Failed to fetch report data: ${e.message}`); 
    } finally {
      setIsReportLoading(false);
      setIsLoading(false); 
    }
  }, []);

  const fetchRegistrationDetails = useCallback(() => {
    if (!registrationNo) {
      setError("Please enter a registration number to search.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    fetchReport(registrationNo);
    
  }, [registrationNo, fetchReport]);

  const handleClear = useCallback(() => {
    setRegistrationNo('');
    setError(null);
    setReportData(null);
    setReportError(null);
    setIsReportLoading(false);
  }, []);

  return (
    <>
      <RegistrationSearchTool 
        registrationNo={registrationNo}
        setRegistrationNo={setRegistrationNo}
        fetchRegistrationDetails={fetchRegistrationDetails}
        isLoading={isLoading}
        error={error}
        onClear={handleClear}
      />

      <FormPreview
        reportData={reportData}
        loading={isReportLoading}
        error={reportError}
        registrationNo={registrationNo} 
        instruments={instruments}
        chemicals={chemicals}
        standards={standards}
        columns={columns}
        isReferenceDataLoading={isReferenceDataLoading}
        referenceDataError={referenceDataError}
      />
    </>
  );
}

export default App;