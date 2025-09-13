# Test admin login and available courses endpoint

$API_BASE = "https://finallitera.onrender.com/api"

Write-Host "🔐 Testing admin login..." -ForegroundColor Yellow

try {
    # Test admin login
    $loginBody = @{
        email = "admin@example.com"
        password = "admin123"
    } | ConvertTo-Json

    $loginResponse = Invoke-WebRequest -Uri "$API_BASE/admin/login" -Method POST -Body $loginBody -ContentType "application/json"
    
    Write-Host "Login status: $($loginResponse.StatusCode)" -ForegroundColor Green
    
    if ($loginResponse.StatusCode -eq 200) {
        $loginData = $loginResponse.Content | ConvertFrom-Json
        Write-Host "✅ Admin login successful!" -ForegroundColor Green
        Write-Host "Token preview: $($loginData.token.Substring(0, 20))..." -ForegroundColor Cyan
        
        # Test available courses endpoint with valid token
        Write-Host "`n📚 Testing available courses with valid token..." -ForegroundColor Yellow
        
        $headers = @{
            "Content-Type" = "application/json"
            "Authorization" = "Bearer $($loginData.token)"
        }
        
        $coursesResponse = Invoke-WebRequest -Uri "$API_BASE/admin/courses/available" -Method GET -Headers $headers
        
        Write-Host "Courses status: $($coursesResponse.StatusCode)" -ForegroundColor Green
        
        if ($coursesResponse.StatusCode -eq 200) {
            $coursesData = $coursesResponse.Content | ConvertFrom-Json
            Write-Host "✅ Available courses endpoint working!" -ForegroundColor Green
            Write-Host "Found $($coursesData.data.courses.Count) courses:" -ForegroundColor Cyan
            
            foreach ($course in $coursesData.data.courses) {
                Write-Host "   - $($course.title) ($($course.level)) - ₹$($course.price)" -ForegroundColor White
            }
        } else {
            Write-Host "❌ Available courses failed with status: $($coursesResponse.StatusCode)" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ Admin login failed with status: $($loginResponse.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Test failed: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $errorResponse = $_.Exception.Response
        Write-Host "Error status: $($errorResponse.StatusCode)" -ForegroundColor Red
        
        try {
            $errorStream = $errorResponse.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($errorStream)
            $errorContent = $reader.ReadToEnd()
            Write-Host "Error content: $errorContent" -ForegroundColor Red
        } catch {
            Write-Host "Could not read error content" -ForegroundColor Red
        }
    }
}