export interface UserInterface {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin" ;
  isBlocked: boolean
  quizzesTaken: number
  avgScore: number
  joined: string
}
