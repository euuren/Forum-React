import { Routes, Route, Navigate } from "react-router-dom";
import AnswerEdit from "./containers/AnswerEdit";
import Login from "./containers/Login";
import MyAnswers from "./containers/MyAnswers";
import MyProfile from "./containers/MyProfile";
import MyQuestions from "./containers/MyQuestions";
import ProfileEdit from "./containers/ProfileEdit";
import QuestionEdit from "./containers/QuestionEdit";
import QuestionsList from "./containers/QuestionsList";
import SearchResults from "./containers/SearchResults";
import Signup from "./containers/Signup";
import SingleQuestion from "./containers/SingleQuestion";
import SubmitAnswer from "./containers/SubmitAnswer";
import SubmitQuestion from "./containers/SubmitQuestion";
import ProtectedRoute from "./components/ProtectedRoutes";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  return (
    <div className="wrapper">
      <div className="content-wrapper">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/users/:id/edit" element={<ProfileEdit />} />
            <Route path="/questions/:id/edit" element={<QuestionEdit />} />
            <Route path="/answers/:id/edit" element={<AnswerEdit />} />
            <Route path="/questions/:id/submitanswer" element={<SubmitAnswer />} />
            <Route path="/questions/:id" element={<SingleQuestion />} />
            <Route path="/questions" element={<QuestionsList />} />
            <Route path="/questions/new" element={<SubmitQuestion />} />
            <Route path="/users/:id/myquestions" element={<MyQuestions />} />
            <Route path="/users/:id/myanswers" element={<MyAnswers />} />
            <Route path="/users/:id/myprofile" element={<MyProfile />} />
            <Route path="/search" element={<SearchResults />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;