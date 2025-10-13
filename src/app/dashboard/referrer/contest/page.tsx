import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import {
  Trophy,
  Medal,
  Award,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Target,
  Star,
  Crown,
} from 'lucide-react'

export const metadata = {
  title: 'Contest | Tax Genius Pro',
  description: 'View contest leaderboard and prizes',
}

async function isReferrer() {
  const user = await currentUser()
  if (!user) return false
  const role = user.publicMetadata?.role
  return role === 'referrer' || role === 'admin'
}

export default async function ReferrerContestPage() {
  const userIsReferrer = await isReferrer()

  if (!userIsReferrer) {
    redirect('/forbidden')
  }

  const user = await currentUser()
  const currentUserName = user?.firstName || user?.emailAddresses[0]?.emailAddress || 'You'

  // Mock contest data
  const currentContest = {
    name: 'Spring Tax Season Challenge',
    startDate: '2024-03-01',
    endDate: '2024-04-15',
    prize1: '$5,000 Cash',
    prize2: '$3,000 Cash',
    prize3: '$1,500 Cash',
    totalParticipants: 156,
    daysRemaining: 22,
  }

  const leaderboard = [
    {
      rank: 1,
      name: 'Sarah Johnson',
      avatar: 'SJ',
      referrals: 42,
      earnings: 2100,
      trend: 'up',
    },
    {
      rank: 2,
      name: 'Michael Chen',
      avatar: 'MC',
      referrals: 38,
      earnings: 1900,
      trend: 'same',
    },
    {
      rank: 3,
      name: 'Emily Rodriguez',
      avatar: 'ER',
      referrals: 35,
      earnings: 1750,
      trend: 'down',
    },
    {
      rank: 4,
      name: 'David Thompson',
      avatar: 'DT',
      referrals: 32,
      earnings: 1600,
      trend: 'up',
    },
    {
      rank: 5,
      name: currentUserName,
      avatar: user?.firstName?.[0] + (user?.lastName?.[0] || '') || 'U',
      referrals: 28,
      earnings: 1400,
      trend: 'up',
      isCurrentUser: true,
    },
    {
      rank: 6,
      name: 'Jessica Martinez',
      avatar: 'JM',
      referrals: 25,
      earnings: 1250,
      trend: 'same',
    },
    {
      rank: 7,
      name: 'Robert Wilson',
      avatar: 'RW',
      referrals: 23,
      earnings: 1150,
      trend: 'up',
    },
    {
      rank: 8,
      name: 'Amanda Davis',
      avatar: 'AD',
      referrals: 21,
      earnings: 1050,
      trend: 'down',
    },
  ]

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 3:
        return <Award className="w-5 h-5 text-orange-600" />
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
    }
  }

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
      case 2:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300'
      case 3:
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
      default:
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
    }
  }

  const yourRank = leaderboard.find(l => l.isCurrentUser)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contest Leaderboard</h1>
          <p className="text-muted-foreground mt-1">
            Compete with other referrers and win amazing prizes
          </p>
        </div>
        <Button variant="outline">
          <Trophy className="w-4 h-4 mr-2" />
          Contest Rules
        </Button>
      </div>

      {/* Current Contest Banner */}
      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">{currentContest.name}</CardTitle>
                <CardDescription>
                  {new Date(currentContest.startDate).toLocaleDateString()} - {new Date(currentContest.endDate).toLocaleDateString()}
                </CardDescription>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{currentContest.daysRemaining}</div>
              <p className="text-sm text-muted-foreground">Days Remaining</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3 p-4 bg-background rounded-lg border">
              <Crown className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">1st Place</p>
                <p className="text-lg font-bold">{currentContest.prize1}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-background rounded-lg border">
              <Medal className="w-8 h-8 text-gray-400" />
              <div>
                <p className="text-sm text-muted-foreground">2nd Place</p>
                <p className="text-lg font-bold">{currentContest.prize2}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-background rounded-lg border">
              <Award className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">3rd Place</p>
                <p className="text-lg font-bold">{currentContest.prize3}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Your Performance */}
      {yourRank && (
        <Card className="border-primary">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              <CardTitle>Your Performance</CardTitle>
            </div>
            <CardDescription>Track your progress in the contest</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Current Rank</p>
                <div className="flex items-center gap-2">
                  <Badge className={getRankBadgeColor(yourRank.rank)}>
                    #{yourRank.rank}
                  </Badge>
                  <span className="text-2xl font-bold">of {currentContest.totalParticipants}</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Referrals</p>
                <div className="text-2xl font-bold flex items-center gap-2">
                  {yourRank.referrals}
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <div className="text-2xl font-bold text-green-600">
                  ${yourRank.earnings}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">To Next Rank</p>
                <div className="text-2xl font-bold text-primary">
                  {leaderboard[yourRank.rank - 2]?.referrals - yourRank.referrals || 0}
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress to #1</span>
                <span className="font-medium">
                  {yourRank.referrals} / {leaderboard[0].referrals}
                </span>
              </div>
              <Progress
                value={(yourRank.referrals / leaderboard[0].referrals) * 100}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Leaderboard</CardTitle>
              <CardDescription>Top performing referrers</CardDescription>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              {currentContest.totalParticipants} participants
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaderboard.map((entry) => (
              <div
                key={entry.rank}
                className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                  entry.isCurrentUser
                    ? 'bg-primary/5 border-primary shadow-md'
                    : 'hover:bg-accent/50'
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  {/* Rank */}
                  <div className="w-12 flex justify-center">
                    {getRankIcon(entry.rank)}
                  </div>

                  {/* Avatar & Name */}
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className={entry.rank <= 3 ? 'bg-primary/20' : ''}>
                      {entry.avatar}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">
                        {entry.name}
                        {entry.isCurrentUser && (
                          <Badge variant="outline" className="ml-2">You</Badge>
                        )}
                      </p>
                      {entry.rank <= 3 && (
                        <Badge className={getRankBadgeColor(entry.rank)}>
                          Prize Winner
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {entry.referrals} referrals
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        ${entry.earnings}
                      </span>
                    </div>
                  </div>

                  {/* Trend */}
                  <div className="text-right">
                    {entry.trend === 'up' && (
                      <Badge className="bg-green-100 text-green-700">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Rising
                      </Badge>
                    )}
                    {entry.trend === 'down' && (
                      <Badge className="bg-red-100 text-red-700">
                        Falling
                      </Badge>
                    )}
                    {entry.trend === 'same' && (
                      <Badge variant="outline">
                        Stable
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-muted/30 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">
              Showing top 8 participants. <Button variant="link" className="p-0 h-auto">View full leaderboard</Button>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Contest Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              <CardTitle>Contest Goals</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Minimum Referrals</span>
              <Badge variant="outline">5</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Qualifying Period</span>
              <Badge variant="outline">45 days</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Prize Pool</span>
              <Badge className="bg-green-100 text-green-700">$9,500</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <CardTitle>Important Dates</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Contest Start</span>
              <span className="text-sm font-medium">
                {new Date(currentContest.startDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Contest End</span>
              <span className="text-sm font-medium">
                {new Date(currentContest.endDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Winner Announcement</span>
              <span className="text-sm font-medium">April 20, 2024</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              <CardTitle>How to Win</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>1. Refer as many clients as possible</p>
            <p>2. Help clients complete their returns</p>
            <p>3. Earn points for each filed return</p>
            <p>4. Top 3 referrers win prizes!</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
