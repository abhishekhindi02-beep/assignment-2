import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import Landing from '@/features/landing/Landing';
import ReferenceFrames from '@/features/referenceFrames/ReferenceFrames';
import GalileanRelativity from '@/features/galilean/GalileanRelativity';
import EinsteinsPostulates from '@/features/postulates/EinsteinsPostulates';
import LorentzTransformations from '@/features/lorentz/LorentzTransformations';
import TimeDilation from '@/features/timeDilation/TimeDilation';
import LengthContraction from '@/features/lengthContraction/LengthContraction';
import VelocityAddition from '@/features/velocityAddition/VelocityAddition';
import Simultaneity from '@/features/simultaneity/Simultaneity';
import MuonDecay from '@/features/muon/MuonDecay';
import SpacetimeDiagrams from '@/features/spacetime/SpacetimeDiagrams';
import LightCones from '@/features/lightCones/LightCones';
import Worldlines from '@/features/worldlines/Worldlines';
import RelativityLabPage from '@/features/lab/RelativityLabPage';
import FinalChallenge from '@/features/challenge/FinalChallenge';
import Reflection from '@/features/reflection/Reflection';

function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/reference-frames" element={<ReferenceFrames />} />
          <Route path="/galilean-relativity" element={<GalileanRelativity />} />
          <Route path="/einsteins-postulates" element={<EinsteinsPostulates />} />
          <Route path="/lorentz-transformations" element={<LorentzTransformations />} />
          <Route path="/time-dilation" element={<TimeDilation />} />
          <Route path="/length-contraction" element={<LengthContraction />} />
          <Route path="/velocity-addition" element={<VelocityAddition />} />
          <Route path="/simultaneity" element={<Simultaneity />} />
          <Route path="/muon-decay" element={<MuonDecay />} />
          <Route path="/spacetime-diagrams" element={<SpacetimeDiagrams />} />
          <Route path="/light-cones" element={<LightCones />} />
          <Route path="/worldlines" element={<Worldlines />} />
          <Route path="/relativity-lab" element={<RelativityLabPage />} />
          <Route path="/final-challenge" element={<FinalChallenge />} />
          <Route path="/reflection" element={<Reflection />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;
