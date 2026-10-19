import { AppShell } from "./components/AppShell";
import { ToastProvider } from "./components/Toasts";
import { Activity } from "./screens/Activity";
import { Calendar } from "./screens/Calendar";
import { Compose } from "./screens/Compose";
import { Designs } from "./screens/Designs";
import { Home } from "./screens/Home";
import { Engagement } from "./screens/Engagement";
import { Inbox } from "./screens/Inbox";
import { People } from "./screens/People";
import { ConnectDesign, ConnectSocial, Connected, Guide, MagicLink, SignIn } from "./screens/Onboarding";
import { StoreProvider, useRouter } from "./store";

function Screens() {
  const { route, param } = useRouter();
  switch (route) {
    case "signin": return <SignIn />;
    case "sent": return <MagicLink />;
    case "guide": return <Guide />;
    case "connect-design": return <ConnectDesign />;
    case "connect-social": return <ConnectSocial />;
    case "connected": return <Connected />;
  }
  const screen = {
    home: <Home />,
    designs: <Designs />,
    calendar: <Calendar />,
    compose: <Compose key={param} postId={param} />,
    activity: <Activity />,
    inbox: <Inbox />,
    engagement: <Engagement />,
    people: <People />
  }[route as string] ?? <Home />;
  return <AppShell route={route}>{screen}</AppShell>;
}

export default function App() {
  return (
    <StoreProvider>
      <ToastProvider>
        <Screens />
      </ToastProvider>
    </StoreProvider>
  );
}
