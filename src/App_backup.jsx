import React, { useState } from 'react'
import { useVitalityData } from './hooks/useLocalStorage'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Calendar, 
  Target, 
  TrendingUp, 
  Award, 
  User, 
  CheckCircle, 
  BarChart3,
  BookOpen,
  Trophy,
  Settings,
  Plus,
  Scale,
  Heart,
  Brain,
  Dna,
  Utensils
} from 'lucide-react'

// Importar imagens
import heroImage from './assets/hero_boas_vindas.png'
import iconeMedicinaRegenerativa from './assets/icone_medicina_regenerativa.png'
import iconeNutrologia from './assets/icone_nutrologia.png'
import iconePsiquiatria from './assets/icone_psiquiatria.png'
import iconeGerenciamentoPeso from './assets/icone_gerenciamento_peso.png'

function App() {
  const { 
    userData, 
    saveCheckin, 
    completeOnboarding, 
    resetData, 
    addCustomGoal,
    getStats, 
    getAchievements,
    getLongTermGoals
  } = useVitalityData()
  
  const [currentScreen, setCurrentScreen] = useState('dashboard')
  const [onboardingStep, setOnboardingStep] = useState(1)
  const [profileForm, setProfileForm] = useState({
    name: '',
    age: '',
    objectives: []
  })

  // Estados para check-in
  const [checkinData, setCheckinData] = useState({
    medicinaRegenerativa: {
      jejum: false,
      sono: false,
      hidratacao: false
    },
    nutrologia: {
      refeicao: false,
      suplementos: false,
      exercicio: false
    },
    psiquiatria: {
      meditacao: false,
      gratidao: false,
      humor: 3
    },
    gerenciamentoPeso: {
      pesagem: false,
      controleAlimentar: false
    },
    notas: ''
  })

  // Estado para nova meta personalizada
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetDays: ''
  })

  const stats = getStats()
  const achievements = getAchievements()
  const longTermGoals = getLongTermGoals()

  // Verificar se deve mostrar onboarding
  if (!userData.hasCompletedOnboarding) {
    return <OnboardingFlow 
      step={onboardingStep}
      setStep={setOnboardingStep}
      profileForm={profileForm}
      setProfileForm={setProfileForm}
      onComplete={completeOnboarding}
    />
  }

  // Função para salvar check-in
  const handleSaveCheckin = () => {
    const points = saveCheckin(stats.totalDays + 1, checkinData)
    
    // Reset do formulário
    setCheckinData({
      medicinaRegenerativa: {
        jejum: false,
        sono: false,
        hidratacao: false
      },
      nutrologia: {
        refeicao: false,
        suplementos: false,
        exercicio: false
      },
      psiquiatria: {
        meditacao: false,
        gratidao: false,
        humor: 3
      },
      gerenciamentoPeso: {
        pesagem: false,
        controleAlimentar: false
      },
      notas: ''
    })
    
    setCurrentScreen('dashboard')
    alert(`Check-in salvo! Você ganhou ${points} pontos!`)
  }

  // Função para adicionar meta personalizada
  const handleAddCustomGoal = () => {
    if (newGoal.title && newGoal.targetDays) {
      addCustomGoal({
        title: newGoal.title,
        description: newGoal.description,
        targetDays: parseInt(newGoal.targetDays)
      })
      setNewGoal({ title: '', description: '', targetDays: '' })
      alert('Meta personalizada adicionada!')
    }
  }

  // Renderizar tela atual
  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <DashboardScreen 
          userData={userData}
          stats={stats}
          onNavigate={setCurrentScreen}
        />
      case 'checkin':
        return <CheckinScreen 
          checkinData={checkinData}
          setCheckinData={setCheckinData}
          onSave={handleSaveCheckin}
          stats={stats}
        />
      case 'progress':
        return <ProgressScreen 
          stats={stats}
          longTermGoals={longTermGoals}
        />
      case 'learn':
        return <LearnScreen />
      case 'achievements':
        return <AchievementsScreen achievements={achievements} />
      case 'profile':
        return <ProfileScreen 
          userData={userData}
          stats={stats}
          onReset={resetData}
        />
      case 'goals':
        return <GoalsScreen 
          longTermGoals={longTermGoals}
          newGoal={newGoal}
          setNewGoal={setNewGoal}
          onAddGoal={handleAddCustomGoal}
        />
      default:
        return <DashboardScreen 
          userData={userData}
          stats={stats}
          onNavigate={setCurrentScreen}
        />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-lg">
        {/* Conteúdo principal */}
        <div className="pb-20">
          {renderCurrentScreen()}
        </div>

        {/* Navegação inferior */}
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200">
          <div className="flex justify-around py-2">
            <NavButton 
              icon={<Calendar className="w-5 h-5" />}
              label="Hoje"
              active={currentScreen === 'dashboard'}
              onClick={() => setCurrentScreen('dashboard')}
            />
            <NavButton 
              icon={<BarChart3 className="w-5 h-5" />}
              label="Progresso"
              active={currentScreen === 'progress'}
              onClick={() => setCurrentScreen('progress')}
            />
            <NavButton 
              icon={<BookOpen className="w-5 h-5" />}
              label="Aprender"
              active={currentScreen === 'learn'}
              onClick={() => setCurrentScreen('learn')}
            />
            <NavButton 
              icon={<Trophy className="w-5 h-5" />}
              label="Conquistas"
              active={currentScreen === 'achievements'}
              onClick={() => setCurrentScreen('achievements')}
            />
            <NavButton 
              icon={<User className="w-5 h-5" />}
              label="Perfil"
              active={currentScreen === 'profile'}
              onClick={() => setCurrentScreen('profile')}
            />
            <NavButton 
              icon={<Target className="w-5 h-5" />}
              label="Metas"
              active={currentScreen === 'goals'}
              onClick={() => setCurrentScreen('goals')}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente de botão de navegação
function NavButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
        active 
          ? 'text-blue-600 bg-blue-50' 
          : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
      }`}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </button>
  )
}

// Componente de Onboarding
function OnboardingFlow({ step, setStep, profileForm, setProfileForm, onComplete }) {
  const handleObjectiveToggle = (objective) => {
    setProfileForm(prev => ({
      ...prev,
      objectives: prev.objectives.includes(objective)
        ? prev.objectives.filter(obj => obj !== objective)
        : [...prev.objectives, objective]
    }))
  }

  const handleComplete = () => {
    onComplete(profileForm)
  }

  if (step === 1) {
    return (
      <div className="p-6 text-center">
        <img src={heroImage} alt="Bem-vindo" className="w-full h-48 object-cover rounded-lg mb-6" />
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Bem-vindo ao Desafio Vitalidade
        </h1>
        <p className="text-gray-600 mb-8">
          30 dias para transformar sua vida através dos 4 pilares fundamentais da longevidade saudável.
        </p>
        <Button onClick={() => setStep(2)} className="w-full">
          Continuar
        </Button>
      </div>
    )
  }

  if (step === 2) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold text-center mb-6">Conheça os 4 Pilares</h2>
        <div className="space-y-4">
          <PillarCard 
            icon={iconeMedicinaRegenerativa}
            title="Medicina Regenerativa"
            description="Autofagia, telômeros e células-tronco"
            color="bg-green-100"
          />
          <PillarCard 
            icon={iconeNutrologia}
            title="Nutrologia"
            description="Culinárias mediterrânea, asiática e brasileira"
            color="bg-blue-100"
          />
          <PillarCard 
            icon={iconePsiquiatria}
            title="Psiquiatria"
            description="Saúde mental e espiritual"
            color="bg-purple-100"
          />
          <PillarCard 
            icon={iconeGerenciamentoPeso}
            title="Gerenciamento do Peso"
            description="Equilíbrio alimentar sem sofrimento"
            color="bg-orange-100"
          />
        </div>
        <Button onClick={() => setStep(3)} className="w-full mt-6">
          Continuar
        </Button>
      </div>
    )
  }

  if (step === 3) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold text-center mb-6">Conte-nos sobre você</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={profileForm.name}
              onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Seu nome"
            />
          </div>
          <div>
            <Label htmlFor="age">Idade</Label>
            <Input
              id="age"
              type="number"
              value={profileForm.age}
              onChange={(e) => setProfileForm(prev => ({ ...prev, age: e.target.value }))}
              placeholder="Sua idade"
            />
          </div>
        </div>
        <Button 
          onClick={() => setStep(4)} 
          className="w-full mt-6"
          disabled={!profileForm.name || !profileForm.age}
        >
          Continuar
        </Button>
      </div>
    )
  }

  if (step === 4) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold text-center mb-6">Quais são seus objetivos?</h2>
        <div className="space-y-3">
          {[
            'Mais energia',
            'Melhor sono',
            'Perder peso',
            'Ganhar massa muscular',
            'Reduzir estresse',
            'Longevidade',
            'Melhor humor'
          ].map(objective => (
            <button
              key={objective}
              onClick={() => handleObjectiveToggle(objective)}
              className={`w-full p-3 rounded-lg border text-left transition-colors ${
                profileForm.objectives.includes(objective)
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {objective}
            </button>
          ))}
        </div>
        <Button 
          onClick={() => setStep(5)} 
          className="w-full mt-6"
          disabled={profileForm.objectives.length === 0}
        >
          Continuar
        </Button>
      </div>
    )
  }

  if (step === 5) {
    return (
      <div className="p-6 text-center">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Tudo pronto!</h2>
          <p className="text-gray-600">
            Você está pronto para começar sua jornada de 30 dias rumo à vitalidade.
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <p className="text-sm text-gray-600">
            <strong>Nome:</strong> {profileForm.name}<br />
            <strong>Idade:</strong> {profileForm.age} anos<br />
            <strong>Objetivos:</strong> {profileForm.objectives.join(', ')}
          </p>
        </div>
        <Button onClick={handleComplete} className="w-full">
          Iniciar Desafio
        </Button>
      </div>
    )
  }
}

// Componente de card do pilar
function PillarCard({ icon, title, description, color }) {
  return (
    <div className={`p-4 rounded-lg ${color} flex items-center space-x-3`}>
      <img src={icon} alt={title} className="w-12 h-12" />
      <div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  )
}

// Tela do Dashboard
function DashboardScreen({ userData, stats, onNavigate }) {
  const currentDate = new Date().toLocaleDateString('pt-BR')
  
  // Calcular dias restantes para próxima meta
  const nextGoal = [30, 90, 180, 360].find(goal => goal > stats.totalDays)
  const daysToNextGoal = nextGoal ? nextGoal - stats.totalDays : 0

  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Olá, {userData.profile.name}!
        </h1>
        <p className="text-gray-600">
          Ciclo {stats.currentCycle} • Dia {stats.currentCycleDays + 1} de 30
        </p>
        <p className="text-sm text-gray-500">{currentDate}</p>
      </div>

      {/* Progresso circular */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-200"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - stats.progressPercentage / 100)}`}
                  className="text-green-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">
                    {stats.currentCycleDays + 1}
                  </div>
                  <div className="text-sm text-gray-600">de 30</div>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600">{stats.progressPercentage}% completado</p>
          </div>
        </CardContent>
      </Card>

      {/* Botões de ação */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Button 
          onClick={() => onNavigate('checkin')}
          className="h-16 bg-green-600 hover:bg-green-700"
        >
          <div className="text-center">
            <CheckCircle className="w-6 h-6 mx-auto mb-1" />
            <span className="text-sm">Check-in Hoje</span>
          </div>
        </Button>
        <Button 
          onClick={() => onNavigate('progress')}
          variant="outline"
          className="h-16"
        >
          <div className="text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-1" />
            <span className="text-sm">Ver Progresso</span>
          </div>
        </Button>
      </div>

      {/* Dica do dia */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <BookOpen className="w-5 h-5 mr-2" />
            Dica do Dia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-3">
            <img src={iconeMedicinaRegenerativa} alt="Medicina Regenerativa" className="w-8 h-8" />
            <div>
              <p className="text-sm text-gray-600">
                Pratique o jejum intermitente de 16 horas para estimular a autofagia celular. 
                Comece gradualmente e sempre consulte um profissional.
              </p>
              <Button variant="link" className="p-0 h-auto text-xs">
                Ler mais →
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-gray-800">{stats.totalDays}</div>
            <div className="text-xs text-gray-600">Dias Totais</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-gray-800">{stats.totalPoints}</div>
            <div className="text-xs text-gray-600">Pontos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-gray-800">{stats.streak}</div>
            <div className="text-xs text-gray-600">Sequência</div>
          </CardContent>
        </Card>
      </div>

      {/* Próxima meta */}
      {nextGoal && (
        <Card className="mt-4">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">🎯 Próxima Meta: {nextGoal} dias</p>
                <p className="text-xs text-gray-600">{daysToNextGoal} dias restantes</p>
              </div>
              <Badge variant="outline">{Math.round((stats.totalDays / nextGoal) * 100)}%</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Streak */}
      {stats.streak > 0 && (
        <Card className="mt-4">
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🔥</span>
              <div>
                <p className="text-sm font-medium">{stats.streak} dias consecutivos</p>
                <p className="text-xs text-gray-600">Continue assim!</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Tela de Check-in
function CheckinScreen({ checkinData, setCheckinData, onSave, stats }) {
  const currentDate = new Date().toLocaleDateString('pt-BR')

  const handleCheckboxChange = (category, field) => {
    setCheckinData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: !prev[category][field]
      }
    }))
  }

  const handleHumorChange = (humor) => {
    setCheckinData(prev => ({
      ...prev,
      psiquiatria: {
        ...prev.psiquiatria,
        humor
      }
    }))
  }

  const handleNotesChange = (notes) => {
    setCheckinData(prev => ({
      ...prev,
      notas: notes
    }))
  }

  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-gray-800">Como foi seu dia?</h1>
        <p className="text-gray-600">Ciclo {stats.currentCycle} • Dia {stats.currentCycleDays + 1}</p>
        <p className="text-sm text-gray-500">{currentDate}</p>
      </div>

      <div className="space-y-6">
        {/* Medicina Regenerativa */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <img src={iconeMedicinaRegenerativa} alt="Medicina Regenerativa" className="w-6 h-6 mr-2" />
              Medicina Regenerativa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <CheckboxItem
              label="Jejum intermitente (16h)"
              checked={checkinData.medicinaRegenerativa.jejum}
              onChange={() => handleCheckboxChange('medicinaRegenerativa', 'jejum')}
              points={10}
            />
            <CheckboxItem
              label="Sono adequado (7-9h)"
              checked={checkinData.medicinaRegenerativa.sono}
              onChange={() => handleCheckboxChange('medicinaRegenerativa', 'sono')}
              points={10}
            />
            <CheckboxItem
              label="Hidratação (2L+)"
              checked={checkinData.medicinaRegenerativa.hidratacao}
              onChange={() => handleCheckboxChange('medicinaRegenerativa', 'hidratacao')}
              points={10}
            />
          </CardContent>
        </Card>

        {/* Nutrologia */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <img src={iconeNutrologia} alt="Nutrologia" className="w-6 h-6 mr-2" />
              Nutrologia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <CheckboxItem
              label="Refeição mediterrânea/asiática/brasileira"
              checked={checkinData.nutrologia.refeicao}
              onChange={() => handleCheckboxChange('nutrologia', 'refeicao')}
              points={10}
            />
            <CheckboxItem
              label="Suplementos recomendados"
              checked={checkinData.nutrologia.suplementos}
              onChange={() => handleCheckboxChange('nutrologia', 'suplementos')}
              points={10}
            />
            <CheckboxItem
              label="Exercício físico"
              checked={checkinData.nutrologia.exercicio}
              onChange={() => handleCheckboxChange('nutrologia', 'exercicio')}
              points={10}
            />
          </CardContent>
        </Card>

        {/* Psiquiatria */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <img src={iconePsiquiatria} alt="Psiquiatria" className="w-6 h-6 mr-2" />
              Psiquiatria
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <CheckboxItem
              label="Meditação/mindfulness"
              checked={checkinData.psiquiatria.meditacao}
              onChange={() => handleCheckboxChange('psiquiatria', 'meditacao')}
              points={10}
            />
            <CheckboxItem
              label="Prática de gratidão"
              checked={checkinData.psiquiatria.gratidao}
              onChange={() => handleCheckboxChange('psiquiatria', 'gratidao')}
              points={10}
            />
            <div className="space-y-2">
              <Label>Como se sente hoje? (1-5)</Label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map(mood => (
                  <button
                    key={mood}
                    onClick={() => handleHumorChange(mood)}
                    className={`w-12 h-12 rounded-full text-xl transition-colors ${
                      checkinData.psiquiatria.humor === mood
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {['😞', '😐', '🙂', '😊', '😄'][mood - 1]}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500">+{checkinData.psiquiatria.humor * 2} pontos</p>
            </div>
          </CardContent>
        </Card>

        {/* Gerenciamento do Peso */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <img src={iconeGerenciamentoPeso} alt="Gerenciamento do Peso" className="w-6 h-6 mr-2" />
              Gerenciamento do Peso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <CheckboxItem
              label="Pesagem registrada"
              checked={checkinData.gerenciamentoPeso.pesagem}
              onChange={() => handleCheckboxChange('gerenciamentoPeso', 'pesagem')}
              points={10}
            />
            <CheckboxItem
              label="Controle alimentar"
              checked={checkinData.gerenciamentoPeso.controleAlimentar}
              onChange={() => handleCheckboxChange('gerenciamentoPeso', 'controleAlimentar')}
              points={10}
            />
          </CardContent>
        </Card>

        {/* Notas do dia */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">📝 Notas do Dia</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Como se sente hoje? Alguma observação especial?"
              value={checkinData.notas}
              onChange={(e) => handleNotesChange(e.target.value)}
              className="min-h-[80px]"
            />
          </CardContent>
        </Card>
      </div>

      {/* Botão salvar */}
      <div className="mt-8 pb-4">
        <Button onClick={onSave} className="w-full bg-green-600 hover:bg-green-700">
          Salvar Check-in
        </Button>
      </div>
    </div>
  )
}

// Componente de item de checkbox
function CheckboxItem({ label, checked, onChange, points }) {
  return (
    <div className="flex items-center justify-between">
      <label className="flex items-center space-x-3 cursor-pointer flex-1">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
        />
        <span className="text-sm">{label}</span>
      </label>
      <Badge variant={checked ? "default" : "outline"} className="text-xs">
        {checked ? `+${points}` : points}
      </Badge>
    </div>
  )
}

// Tela de Progresso
function ProgressScreen({ stats, longTermGoals }) {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-center mb-6">Seu Progresso</h1>

      {/* Visão geral */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>📊 Visão Geral</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-800">{stats.totalDays}</div>
              <div className="text-xs text-gray-600">Dias Totais</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{stats.completedCycles}</div>
              <div className="text-xs text-gray-600">Ciclos Completos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{stats.totalPoints}</div>
              <div className="text-xs text-gray-600">Pontos Totais</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metas de longo prazo */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>🎯 Metas de Longo Prazo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {longTermGoals.predefined.map(goal => (
            <div key={goal.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  {goal.completed ? '✅' : '🔄'} {goal.title}
                </span>
                <span className="text-xs text-gray-600">
                  {goal.completed ? 'Concluído' : `${goal.remainingDays} dias restantes`}
                </span>
              </div>
              <Progress value={goal.progress} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Progresso por pilar (ciclo atual) */}
      <Card>
        <CardHeader>
          <CardTitle>📈 Progresso por Pilar (Ciclo Atual)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProgressBar 
            label="Medicina Regenerativa" 
            value={stats.pilarProgress.medicinaRegenerativa}
            color="bg-green-500"
          />
          <ProgressBar 
            label="Nutrologia" 
            value={stats.pilarProgress.nutrologia}
            color="bg-blue-500"
          />
          <ProgressBar 
            label="Psiquiatria" 
            value={stats.pilarProgress.psiquiatria}
            color="bg-purple-500"
          />
          <ProgressBar 
            label="Gerenciamento do Peso" 
            value={stats.pilarProgress.gerenciamentoPeso}
            color="bg-orange-500"
          />
        </CardContent>
      </Card>
    </div>
  )
}

// Componente de barra de progresso personalizada
function ProgressBar({ label, value, color }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm text-gray-600">{value}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

// Tela de Aprendizado
function LearnScreen() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-center mb-6">Aprender</h1>
      
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <img src={iconeMedicinaRegenerativa} alt="Medicina Regenerativa" className="w-6 h-6 mr-2" />
              Medicina Regenerativa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              Aprenda sobre autofagia, telômeros e células-tronco para uma longevidade saudável.
            </p>
            <Button variant="outline" size="sm">Ler mais</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <img src={iconeNutrologia} alt="Nutrologia" className="w-6 h-6 mr-2" />
              Nutrologia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              Descubra as culinárias mediterrânea, asiática e brasileira para otimizar seu metabolismo.
            </p>
            <Button variant="outline" size="sm">Ler mais</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <img src={iconePsiquiatria} alt="Psiquiatria" className="w-6 h-6 mr-2" />
              Psiquiatria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              Técnicas de motivação e enfrentamento do estresse da vida moderna.
            </p>
            <Button variant="outline" size="sm">Ler mais</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <img src={iconeGerenciamentoPeso} alt="Gerenciamento do Peso" className="w-6 h-6 mr-2" />
              Gerenciamento do Peso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              Emagreça sem sofrimento com estratégias sustentáveis e saudáveis.
            </p>
            <Button variant="outline" size="sm">Ler mais</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Tela de Conquistas
function AchievementsScreen({ achievements }) {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-center mb-6">Suas Conquistas</h1>
      <p className="text-center text-gray-600 mb-6">
        {achievements.reduce((sum, achievement) => sum + (achievement.earned ? 10 : 0), 0)} pontos em conquistas
      </p>

      <div className="grid grid-cols-2 gap-4">
        {achievements.map(achievement => (
          <Card key={achievement.id} className={achievement.earned ? 'border-green-500' : 'border-gray-200'}>
            <CardContent className="pt-4 text-center">
              <div className="text-3xl mb-2">
                {achievement.earned ? '🏆' : '⏳'}
              </div>
              <h3 className="font-semibold text-sm mb-1">{achievement.name}</h3>
              <p className="text-xs text-gray-600">{achievement.description}</p>
              {achievement.earned && (
                <Badge className="mt-2" variant="default">Conquistado</Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Tela de Perfil
function ProfileScreen({ userData, stats, onReset }) {
  const handleReset = () => {
    if (confirm('Tem certeza que deseja resetar todos os dados? Esta ação não pode ser desfeita.')) {
      onReset()
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-center mb-6">Perfil</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Nome:</strong> {userData.profile.name}</p>
            <p><strong>Idade:</strong> {userData.profile.age} anos</p>
            <p><strong>Objetivos:</strong> {userData.profile.objectives.join(', ')}</p>
            <p><strong>Início:</strong> {new Date(userData.startDate).toLocaleDateString('pt-BR')}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Estatísticas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-800">{stats.totalDays}</div>
              <div className="text-xs text-gray-600">Dias Ativos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{stats.totalPoints}</div>
              <div className="text-xs text-gray-600">Pontos Totais</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{stats.streak}</div>
              <div className="text-xs text-gray-600">Sequência Atual</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{stats.completedCycles}</div>
              <div className="text-xs text-gray-600">Ciclos Completos</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configurações</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleReset}
            variant="destructive"
            className="w-full"
          >
            Resetar Dados
          </Button>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Esta ação irá apagar todos os seus dados permanentemente
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

// Tela de Metas
function GoalsScreen({ longTermGoals, newGoal, setNewGoal, onAddGoal }) {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-center mb-6">Metas Personalizadas</h1>

      {/* Metas pré-definidas */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>🎯 Metas Pré-definidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {longTermGoals.predefined.map(goal => (
              <div key={goal.id} className="text-center">
                <div className="text-lg font-bold">
                  {goal.completed ? '✅' : '⏳'} {goal.title}
                </div>
                <div className="text-xs text-gray-600">
                  {goal.completed ? 'Concluído' : `${goal.remainingDays} dias`}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Metas personalizadas */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>✨ Suas Metas Personalizadas</CardTitle>
        </CardHeader>
        <CardContent>
          {longTermGoals.custom.length === 0 ? (
            <p className="text-gray-500 text-center">Nenhuma meta personalizada ainda</p>
          ) : (
            <div className="space-y-3">
              {longTermGoals.custom.map(goal => (
                <div key={goal.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{goal.title}</h3>
                    <Badge variant={goal.completed ? "default" : "outline"}>
                      {goal.completed ? 'Concluído' : 'Em andamento'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Prazo: {goal.targetDays} dias</span>
                    <span>{goal.remainingDays} dias restantes</span>
                  </div>
                  <Progress value={goal.progress} className="h-2 mt-2" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Adicionar nova meta */}
      <Card>
        <CardHeader>
          <CardTitle>+ Adicionar Meta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="goal-title">Título da Meta</Label>
            <Input
              id="goal-title"
              value={newGoal.title}
              onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ex: Correr 5km sem parar"
            />
          </div>
          <div>
            <Label htmlFor="goal-description">Descrição (opcional)</Label>
            <Textarea
              id="goal-description"
              value={newGoal.description}
              onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descreva sua meta..."
              className="min-h-[60px]"
            />
          </div>
          <div>
            <Label htmlFor="goal-days">Prazo (dias)</Label>
            <Input
              id="goal-days"
              type="number"
              value={newGoal.targetDays}
              onChange={(e) => setNewGoal(prev => ({ ...prev, targetDays: e.target.value }))}
              placeholder="Ex: 120"
            />
          </div>
          <Button 
            onClick={onAddGoal}
            className="w-full"
            disabled={!newGoal.title || !newGoal.targetDays}
          >
            Adicionar Meta
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default App

